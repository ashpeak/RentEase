import { CheckCircle, ListChecks, Search, Upload } from "lucide-react"

export function HowItWorks() {
  const steps = [
    {
      title: "List Your Items",
      description: "Create detailed listings for items you want to rent out",
      icon: Upload,
      color: "bg-teal-100 text-teal-700 dark:bg-teal-900/20 dark:text-teal-300",
    },
    {
      title: "Find What You Need",
      description: "Search and browse thousands of items available for rent",
      icon: Search,
      color: "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300",
    },
    {
      title: "Book & Confirm",
      description: "Request booking, confirm details, and arrange pickup",
      icon: CheckCircle,
      color: "bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-300",
    },
    {
      title: "Rent & Return",
      description: "Use the item during your rental period and return on time",
      icon: ListChecks,
      color: "bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-300",
    },
  ]

  return (
    <section className="w-full py-12 bg-muted/50">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center text-center">
          <h2 className="text-3xl font-bold tracking-tight">How It Works</h2>
          <p className="max-w-[700px] text-muted-foreground mt-2">
            Our peer-to-peer rental platform makes it easy to rent items or make money by renting out your own
          </p>
        </div>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4 mt-12">
          {steps.map((step, index) => (
            <div key={step.title} className="flex flex-col items-center text-center">
              <div className={`mb-4 flex h-16 w-16 items-center justify-center rounded-full ${step.color}`}>
                <step.icon className="h-8 w-8" />
              </div>
              <div className="space-y-2">
                <div className="inline-block rounded-full bg-muted px-3 py-1 text-sm font-medium">Step {index + 1}</div>
                <h3 className="text-xl font-bold">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
