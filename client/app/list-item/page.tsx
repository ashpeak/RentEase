"use client"

import type React from "react"

import { useState, useRef, useCallback } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, Camera, Check, Info, Upload, AlertCircle, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { Alert, AlertDescription } from "@/components/ui/alert"
import axios from "axios"
import { useAuth } from "@clerk/nextjs";

// Define interfaces for form data
interface ItemDetailsForm {
  title: string;
  category: string;
  description: string;
  brand: string;
  model: string;
  condition: string;
}

interface PricingForm {
  mainPhoto: string | null; // Changed from File | null
  additionalPhotos: string[]; // Changed from File[]
  price: string; // This will map to 'rate' in the backend
  minRentalPeriodValue: string; // New generalized field
  securityDeposit: string;
}

interface RulesForm {
  rentalRules: string;
  pickupLocation: string;
  deliveryOptions: {
    pickup: boolean;
    localDelivery: boolean;
    shipping: boolean;
  };
  availableFrom: string;
  availableTo: string;
  termsAgreed: boolean;
}

export default function ListItemPage() {
  const { toast } = useToast()
  const [currentStep, setCurrentStep] = useState(1)
  const [activeTab, setActiveTab] = useState("daily")
  const formRef = useRef<HTMLFormElement>(null)
  const [validationErrors, setValidationErrors] = useState<string[]>([])
  const { getToken } = useAuth();

  // Form data state
  const [itemDetails, setItemDetails] = useState<ItemDetailsForm>({
    title: "",
    category: "",
    description: "",
    brand: "",
    model: "",
    condition: ""
  })

  const [pricingDetails, setPricingDetails] = useState<PricingForm>({
    mainPhoto: null,
    additionalPhotos: Array(5).fill(''),
    price: "", 
    minRentalPeriodValue: "1", // Initialize new generalized field
    securityDeposit: ""
  })

  const [rulesDetails, setRulesDetails] = useState<RulesForm>({
    rentalRules: "",
    pickupLocation: "",
    deliveryOptions: {
      pickup: false,
      localDelivery: false,
      shipping: false
    },
    availableFrom: "",
    availableTo: "",
    termsAgreed: false
  })

  // Image preview URLs
  const [imagePreviewUrls, setImagePreviewUrls] = useState<{
    mainPhoto: string | null;
    additionalPhotos: string[];
  }>({
    mainPhoto: null,
    additionalPhotos: Array(5).fill(null)
  });

  // Handle form field changes
  const handleItemDetailsChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setItemDetails(prev => ({
      ...prev,
      [id]: value
    }));
  }

  const handleSelectChange = (id: string, value: string) => {
    setItemDetails(prev => ({
      ...prev,
      [id]: value
    }));
  }

  const handlePricingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setPricingDetails(prev => ({
      ...prev,
      [id]: value
    }));
  }

  const handleRulesChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value, type, checked } = e.target as HTMLInputElement;

    if (type === 'checkbox') {
      if (id === 'terms') {
        setRulesDetails(prev => ({
          ...prev,
          termsAgreed: checked
        }));
      } else {
        setRulesDetails(prev => ({
          ...prev,
          deliveryOptions: {
            ...prev.deliveryOptions,
            [id]: checked
          }
        }));
      }
    } else {
      setRulesDetails(prev => ({
        ...prev,
        [id]: value
      }));
    }
  }

  const handleMainPhotoUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setPricingDetails(prev => ({
      ...prev,
      mainPhoto: url as any, // Store the URL as the main photo
    }));

    setImagePreviewUrls(prev => ({
      ...prev,
      mainPhoto: url, // Update the preview URL
    }));
  };

  const handleAdditionalPhotoUrlChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const url = e.target.value;
    const newAdditionalPhotos = [...pricingDetails.additionalPhotos];
    newAdditionalPhotos[index] = url as any; // Store the URL as the additional photo

    setPricingDetails(prev => ({
      ...prev,
      additionalPhotos: newAdditionalPhotos,
    }));

    const newAdditionalPhotoUrls = [...imagePreviewUrls.additionalPhotos];
    newAdditionalPhotoUrls[index] = url; // Update the preview URL

    setImagePreviewUrls(prev => ({
      ...prev,
      additionalPhotos: newAdditionalPhotoUrls,
    }));
  };

  // Validation functions
  const validateItemDetails = (): boolean => {
    const errors: string[] = [];

    if (!itemDetails.title.trim()) {
      errors.push("Item title is required");
    }

    if (!itemDetails.category) {
      errors.push("Category is required");
    }

    if (!itemDetails.description.trim()) {
      errors.push("Description is required");
    }

    if (!itemDetails.condition) {
      errors.push("Condition is required");
    }

    setValidationErrors(errors);
    return errors.length === 0;
  }

  const validatePricingDetails = (): boolean => {
    const errors: string[] = [];
    
    if (!pricingDetails.mainPhoto) {
      errors.push("Main photo URL is required");
    }
    
    const uploadedAdditionalPhotos = pricingDetails.additionalPhotos.filter(url => url && url.trim() !== '');
    if (uploadedAdditionalPhotos.length < 5) {
      errors.push(`You must provide URLs for all 5 additional photos (${uploadedAdditionalPhotos.length}/5 provided)`);
    }
    
    if (!pricingDetails.price) {
      errors.push(`${activeTab === 'daily' ? 'Daily' : activeTab === 'weekly' ? 'Weekly' : 'Monthly'} price is required`);
    }

    if (!pricingDetails.minRentalPeriodValue) {
      errors.push(`Minimum rental ${activeTab === 'daily' ? 'days' : activeTab === 'weekly' ? 'weeks' : 'months'} is required`);
    }
    
    if (!pricingDetails.securityDeposit) {
      errors.push("Security deposit is required");
    }
    
    setValidationErrors(errors);
    return errors.length === 0;
  }

  const validateRulesDetails = (): boolean => {
    const errors: string[] = [];

    if (!rulesDetails.rentalRules.trim()) {
      errors.push("Rental rules are required");
    }

    if (!rulesDetails.pickupLocation.trim()) {
      errors.push("Pickup/delivery location is required");
    }

    if (!rulesDetails.availableFrom) {
      errors.push("Available from date is required");
    }

    if (!rulesDetails.termsAgreed) {
      errors.push("You must agree to the terms and conditions");
    }

    setValidationErrors(errors);
    return errors.length === 0;
  }

  // Navigation handlers with validation
  const goToNextStep = () => {
    let isValid = false;

    if (currentStep === 1) {
      isValid = validateItemDetails();
      if (isValid) {
        setCurrentStep(2);
        setValidationErrors([]);
      }
    } else if (currentStep === 2) {
      isValid = validatePricingDetails();
      if (isValid) {
        setCurrentStep(3);
        setValidationErrors([]);
      }
    }
  }

  const goToPreviousStep = () => {
    setValidationErrors([]);
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  }

  // Update the handleSubmit function to send JSON data instead of FormData
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Run all validations before submitting
    const isItemDetailsValid = validateItemDetails();
    const isPricingDetailsValid = validatePricingDetails();
    const isRulesDetailsValid = validateRulesDetails();

    if (isItemDetailsValid && isPricingDetailsValid && isRulesDetailsValid) {
      try {
        setValidationErrors([]); // Clear any previous errors

        // Prepare JSON data to send to the backend
        const finalRequestData = {
          // Item Details
          title: itemDetails.title,
          category: itemDetails.category,
          description: itemDetails.description,
          brand: itemDetails.brand,
          model: itemDetails.model,
          condition: itemDetails.condition,

          // Pricing Details
          mainPhoto: pricingDetails.mainPhoto,
          additionalPhotos: pricingDetails.additionalPhotos,
          rate: pricingDetails.price, // Use 'price' from state for 'rate'
          minRentalPeriodValue: pricingDetails.minRentalPeriodValue, // Use generalized field
          selectedPricingModel: activeTab, // This indicates if rate/period is daily, weekly, or monthly
          securityDeposit: pricingDetails.securityDeposit,

          // Rules Details
          rentalRules: rulesDetails.rentalRules,
          pickupLocation: rulesDetails.pickupLocation,
          deliveryOptions: JSON.stringify(rulesDetails.deliveryOptions),
          availableFrom: rulesDetails.availableFrom,
          availableTo: rulesDetails.availableTo || null,
        };

        // Send data to API
        const response = await fetch('http://localhost:3001/api/products', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${await getToken()}`,
          },
          body: JSON.stringify(finalRequestData),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Failed to create listing');
        }

        // Show success message
        toast({
          title: 'Item listed successfully!',
          description: 'Your item has been listed and is now available for rent.',
        });

        // Redirect to dashboard
        window.location.href = '/dashboard/listings';
      } catch (error) {
        console.error('Error submitting form:', error);
        toast({
          title: 'Error listing item',
          description: error instanceof Error ? error.message : 'There was a problem submitting your listing',
          variant: 'destructive',
        });
      }
    }
  }

  return (
    <div className="container py-10">
      <div className="mb-6">
        <Link
          href="/dashboard"
          className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to dashboard
        </Link>
      </div>

      <div className="mx-auto max-w-3xl">
        <div className="flex flex-col gap-2 text-center">
          <h1 className="text-3xl font-bold tracking-tight">List Your Item</h1>
          <p className="text-muted-foreground">
            Share your items with others and earn money when they rent from you
          </p>
        </div>

        <div className="mt-8">
          <div className="relative mb-12">
            <div className="absolute left-0 top-1/2 h-0.5 w-full -translate-y-1/2 bg-muted"></div>
            <ol className="relative z-10 flex justify-between">
              {[1, 2, 3].map((step) => (
                <li key={step} className="flex items-center justify-center">
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium ${currentStep >= step
                        ? "bg-teal-600 text-white"
                        : "bg-muted text-muted-foreground"
                      }`}
                  >
                    {currentStep > step ? <Check className="h-4 w-4" /> : step}
                  </div>
                </li>
              ))}
            </ol>
            <ol className="relative z-0 flex justify-between px-2 pt-3 text-sm">
              <li className="text-center font-medium">Item Details</li>
              <li className="text-center font-medium">Photos & Pricing</li>
              <li className="text-center font-medium">Rules & Availability</li>
            </ol>
          </div>

          {validationErrors.length > 0 && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <div className="mt-2">
                  <ul className="list-disc pl-5">
                    {validationErrors.map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
                </div>
              </AlertDescription>
            </Alert>
          )}

          <form ref={formRef} onSubmit={handleSubmit}>
            {currentStep === 1 && (
              <Card>
                <CardHeader>
                  <CardTitle>Item Details</CardTitle>
                  <CardDescription>
                    Provide detailed information about your item
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="title">
                      Item Title <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="title"
                      placeholder="e.g., Professional DSLR Camera"
                      value={itemDetails.title}
                      onChange={handleItemDetailsChange}
                      required
                    />
                    <p className="text-xs text-muted-foreground">
                      A clear, descriptive title helps renters find your item
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">
                      Category <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      required
                      value={itemDetails.category}
                      onValueChange={(value) => handleSelectChange("category", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="electronics">Electronics</SelectItem>
                        <SelectItem value="cameras">Cameras</SelectItem>
                        <SelectItem value="audio">Audio</SelectItem>
                        <SelectItem value="computers">Computers</SelectItem>
                        <SelectItem value="sports">Sports</SelectItem>
                        <SelectItem value="camping">Camping</SelectItem>
                        <SelectItem value="vehicles">Vehicles</SelectItem>
                        <SelectItem value="home">Home</SelectItem>
                        <SelectItem value="clothing">Clothing</SelectItem>
                        <SelectItem value="kitchen">Kitchen</SelectItem>
                        <SelectItem value="entertainment">Entertainment</SelectItem>
                        <SelectItem value="music">Music</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">
                      Description <span className="text-red-500">*</span>
                    </Label>
                    <Textarea
                      id="description"
                      placeholder="Describe your item in detail, including condition, features, and any included accessories"
                      rows={5}
                      value={itemDetails.description}
                      onChange={handleItemDetailsChange}
                      required
                    />
                    <p className="text-xs text-muted-foreground">
                      Be specific about the condition, features, and any included accessories
                    </p>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="brand">Brand</Label>
                      <Input
                        id="brand"
                        placeholder="e.g., Canon"
                        value={itemDetails.brand}
                        onChange={handleItemDetailsChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="model">Model</Label>
                      <Input
                        id="model"
                        placeholder="e.g., EOS 5D Mark IV"
                        value={itemDetails.model}
                        onChange={handleItemDetailsChange}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="condition">
                      Condition <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      required
                      value={itemDetails.condition}
                      onValueChange={(value) => handleSelectChange("condition", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select condition" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="new">Like New</SelectItem>
                        <SelectItem value="excellent">Excellent</SelectItem>
                        <SelectItem value="good">Good</SelectItem>
                        <SelectItem value="fair">Fair</SelectItem>
                        <SelectItem value="worn">Worn</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button
                    type="button"
                    className="bg-teal-600 hover:bg-teal-700"
                    onClick={goToNextStep}
                  >
                    Continue
                  </Button>
                </CardFooter>
              </Card>
            )}

            {currentStep === 2 && (
              <Card>
                <CardHeader>
                  <CardTitle>Photos & Pricing</CardTitle>
                  <CardDescription>
                    Add photos and set your rental pricing
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label>
                      Photos <span className="text-red-500">*</span>
                    </Label>
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                      <div className="space-y-2">
                        <Input
                          type="text"
                          placeholder="Enter main photo URL"
                          value={typeof pricingDetails.mainPhoto === 'string' ? pricingDetails.mainPhoto : ''}
                          onChange={handleMainPhotoUrlChange}
                          className="z-10 relative" // Ensure input is on top
                        />
                        {imagePreviewUrls.mainPhoto && (
                          <div className="relative flex aspect-square items-center justify-center rounded-md border-2 border-solid border-teal-600 p-2 overflow-hidden">
                            <Image
                              src={imagePreviewUrls.mainPhoto}
                              alt="Main product photo"
                              fill
                              style={{ objectFit: 'cover' }}
                              className="rounded-md"
                            />
                          </div>
                        )}
                      </div>

                      {/* Additional photos upload */}
                      {[0, 1, 2, 3, 4].map((index) => (
                        <div key={index} className="space-y-2">
                          <Input
                            type="text"
                            placeholder={`Enter URL for additional photo ${index + 1}`}
                            value={typeof pricingDetails.additionalPhotos[index] === 'string' ? pricingDetails.additionalPhotos[index] : ''}
                            onChange={(e) => handleAdditionalPhotoUrlChange(e, index)}
                            className="z-10 relative" // Ensure input is on top
                          />
                          {imagePreviewUrls.additionalPhotos[index] && (
                            <div className="relative flex aspect-square items-center justify-center rounded-md border-2 border-solid border-teal-600 p-2 overflow-hidden">
                              <Image
                                src={imagePreviewUrls.additionalPhotos[index]!}
                                alt={`Additional product photo ${index + 1}`}
                                fill
                                style={{ objectFit: 'cover' }}
                                className="rounded-md"
                              />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Upload clear, well-lit photos from multiple angles. The first photo will be your main listing image.
                    </p>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label>
                        Pricing <span className="text-red-500">*</span>
                      </Label>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6"
                              type="button"
                            >
                              <Info className="h-4 w-4" size="icon" />
                              <span className="sr-only">Pricing Info</span>
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="max-w-xs text-xs">
                              Set competitive prices to attract renters. Consider the item's value, condition, and market rates when pricing.
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <Tabs
                      defaultValue="daily"
                      value={activeTab}
                      onValueChange={setActiveTab}
                    >
                      <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="daily">Daily</TabsTrigger>
                        <TabsTrigger value="weekly">Weekly</TabsTrigger>
                        <TabsTrigger value="monthly">Monthly</TabsTrigger>
                      </TabsList>
                      {/* Single content area for price input and generalized min rental period */}
                      <div className="space-y-4 pt-4">
                        <div className="space-y-2">
                          <Label htmlFor="price">
                            {activeTab === 'daily' ? 'Daily Price' : activeTab === 'weekly' ? 'Weekly Price' : 'Monthly Price'} (₹) <span className="text-red-500">*</span>
                          </Label>
                          <div className="relative">
                            <span className="absolute left-3 top-2.5 text-muted-foreground">₹</span>
                            <Input
                              id="price" 
                              type="number"
                              min="1"
                              step="0.01"
                              placeholder="0.00"
                              className="pl-7"
                              value={pricingDetails.price}
                              onChange={handlePricingChange} // Make sure this updates pricingDetails.price
                              required
                            />
                          </div>
                        </div>

                        {/* Generalized Minimum Rental Period Input */}
                        <div className="space-y-2">
                          <Label htmlFor="minRentalPeriodValue">
                            Minimum Rental {activeTab === 'daily' ? 'Days' : activeTab === 'weekly' ? 'Weeks' : 'Months'} <span className="text-red-500">*</span>
                          </Label>
                          <Input
                            id="minRentalPeriodValue" // Single ID for this input
                            type="number"
                            min="1"
                            value={pricingDetails.minRentalPeriodValue} // Bind to the new state field
                            onChange={handlePricingChange} // Ensure this handler updates pricingDetails.minRentalPeriodValue
                            name="minRentalPeriodValue" // Add name attribute for the handler
                            required
                          />
                        </div>
                      </div>
                    </Tabs>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="securityDeposit">
                      Security Deposit (₹) <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5 text-muted-foreground">₹</span>
                      <Input
                        id="securityDeposit"
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="0.00"
                        className="pl-7"
                        value={pricingDetails.securityDeposit}
                        onChange={handlePricingChange}
                        required
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      This refundable amount will be held as security against damage or loss
                    </p>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={goToPreviousStep}
                  >
                    Back
                  </Button>
                  <Button
                    type="button"
                    className="bg-teal-600 hover:bg-teal-700"
                    onClick={goToNextStep}
                  >
                    Continue
                  </Button>
                </CardFooter>
              </Card>
            )}

            {currentStep === 3 && (
              <Card>
                <CardHeader>
                  <CardTitle>Rules & Availability</CardTitle>
                  <CardDescription>
                    Set rental rules and availability for your item
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="rentalRules">
                      Rental Rules <span className="text-red-500">*</span>
                    </Label>
                    <Textarea
                      id="rentalRules"
                      placeholder="Specify any rules or requirements for renting your item"
                      rows={4}
                      value={rulesDetails.rentalRules}
                      onChange={handleRulesChange}
                      required
                    />
                    <p className="text-xs text-muted-foreground">
                      Include any specific requirements, restrictions, or care instructions
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="pickupLocation">
                      Pickup/Delivery Location <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="pickupLocation"
                      placeholder="e.g., New York, NY"
                      value={rulesDetails.pickupLocation}
                      onChange={handleRulesChange}
                      required
                    />
                    <p className="text-xs text-muted-foreground">
                      Enter the general area where renters can pick up the item
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label>
                      Delivery Options
                    </Label>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="pickup"
                          className="h-4 w-4 rounded border-gray-300"
                          checked={rulesDetails.deliveryOptions.pickup}
                          onChange={handleRulesChange}
                        />
                        <Label htmlFor="pickup" className="text-sm font-normal">
                          In-person pickup
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="localDelivery"
                          className="h-4 w-4 rounded border-gray-300"
                          checked={rulesDetails.deliveryOptions.localDelivery}
                          onChange={handleRulesChange}
                        />
                        <Label htmlFor="localDelivery" className="text-sm font-normal">
                          Local delivery
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="shipping"
                          className="h-4 w-4 rounded border-gray-300"
                          checked={rulesDetails.deliveryOptions.shipping}
                          onChange={handleRulesChange}
                        />
                        <Label htmlFor="shipping" className="text-sm font-normal">
                          Shipping
                        </Label>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>
                      Availability <span className="text-red-500">*</span>
                    </Label>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="availableFrom">Available From</Label>
                        <Input
                          id="availableFrom"
                          type="date"
                          value={rulesDetails.availableFrom}
                          onChange={handleRulesChange}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="availableTo">Available To</Label>
                        <Input
                          id="availableTo"
                          type="date"
                          value={rulesDetails.availableTo}
                          onChange={handleRulesChange}
                        />
                        <p className="text-xs text-muted-foreground">
                          Leave blank if always available
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="terms"
                        className="h-4 w-4 rounded border-gray-300"
                        checked={rulesDetails.termsAgreed}
                        onChange={handleRulesChange}
                        required
                      />
                      <Label htmlFor="terms" className="text-sm font-normal">
                        I agree to the{" "}
                        <Link
                          href="/terms"
                          className="text-primary underline-offset-4 hover:underline"
                        >
                          terms of service
                        </Link>{" "}
                        and{" "}
                        <Link
                          href="/privacy"
                          className="text-primary underline-offset-4 hover:underline"
                        >
                          privacy policy
                        </Link>
                      </Label>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={goToPreviousStep}
                  >
                    Back
                  </Button>
                  <Button
                    type="submit"
                    className="bg-teal-600 hover:bg-teal-700"
                  >
                    List Item
                  </Button>
                </CardFooter>
              </Card>
            )}
          </form>
        </div>
      </div>
    </div>
  )
}
