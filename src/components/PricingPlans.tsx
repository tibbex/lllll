
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const monthlyPlans = [
  {
    id: "basic-monthly",
    name: "Basic AI",
    subtitle: "Just the Basics",
    price: "300 birr/month",
    color: "bg-green-500",
    features: [
      "💬 1,000 prompts/week",
      "🖼️ No image generation",
      "🌐 Simple Web UI",
      "🧠 1 AI Model"
    ]
  },
  {
    id: "standard-monthly",
    name: "Standard AI",
    subtitle: "Supercharged Smarts",
    price: "500 birr/month",
    color: "bg-blue-500",
    features: [
      "💬 100,000 prompts/week",
      "🖼️ No image generation",
      "🎨 Sleek Web UI",
      "🧠🧠🧠 3 AI Models"
    ]
  },
  {
    id: "premium-monthly",
    name: "Premium AI",
    subtitle: "Full Power Mode!",
    price: "800 birr/month",
    color: "bg-red-500",
    features: [
      "♾️ Unlimited Prompts",
      "🖼️ Image Generation 🔥",
      "💻 Beautiful Web UI",
      "🧠🧠🧠🧠🧠 5 AI Models"
    ]
  }
];

const sixMonthPlans = [
  {
    id: "basic-6month",
    name: "Basic AI",
    subtitle: "Long Term Genius",
    price: "3000 birr/6 months",
    discountPrice: "2550 birr with first-time 15% discount!",
    color: "bg-green-500",
    features: [
      "📈 1,000 prompts/day",
      "🖼️ No image generation",
      "🌐 Simple Web UI",
      "🧠 1 AI Model"
    ]
  },
  {
    id: "standard-6month",
    name: "Standard AI",
    subtitle: "Smart for Months",
    price: "6000 birr/6 months",
    discountPrice: "5100 birr with first-time 15% discount!",
    color: "bg-blue-500",
    features: [
      "📈 10,000 prompts/day",
      "🖼️ No image generation",
      "🎨 Sleek Web UI",
      "🧠🧠🧠 3 AI Models"
    ]
  },
  {
    id: "premium-6month",
    name: "Premium AI",
    subtitle: "Go Ultra",
    price: "9000 birr/6 months",
    discountPrice: "7650 birr with first-time 15% discount!",
    color: "bg-red-500",
    features: [
      "♾️ Unlimited Prompts",
      "🖼️ Image Generation 🔥",
      "💻 Beautiful Web UI",
      "🧠🧠🧠🧠🧠 5 AI Models"
    ]
  }
];

interface PaymentDialogProps {
  planName: string;
  price: string;
}

function PaymentDialog({ planName, price }: PaymentDialogProps) {
  return (
    <DialogContent className="max-w-md">
      <DialogHeader>
        <DialogTitle>Complete Your Order</DialogTitle>
        <DialogDescription>
          You're ordering: {planName} - {price}
        </DialogDescription>
      </DialogHeader>
      <div className="space-y-4">
        <div className="bg-yellow-50 p-4 rounded-lg border">
          <h3 className="font-semibold mb-2">Payment Instructions:</h3>
          <p className="text-sm mb-2">
            <strong>Send money to:</strong> 0929280801 by Tele Birr
          </p>
          <p className="text-sm mb-2">
            <strong>Amount:</strong> {price}
          </p>
        </div>
        
        <div className="bg-blue-50 p-4 rounded-lg border">
          <h3 className="font-semibold mb-2">After Payment:</h3>
          <p className="text-sm mb-2">
            Send your payment screenshot to: <strong>tibebesolomon79@gmail.com</strong>
          </p>
          <p className="text-sm text-orange-600 font-medium">
            ⏰ Wait 24 hours to get the API that you have paid for to your email
          </p>
        </div>
      </div>
    </DialogContent>
  );
}

export function PricingPlans() {
  return (
    <div className="w-full max-w-6xl mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">🤖✨ AI Subscription Plans – Choose Your Power Level!</h1>
      </div>
      
      <Tabs defaultValue="monthly" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="monthly">📅 Monthly Plans</TabsTrigger>
          <TabsTrigger value="6month">🕰️ 6-Month Plans (Best Value!)</TabsTrigger>
        </TabsList>
        
        <TabsContent value="monthly" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {monthlyPlans.map((plan) => (
              <Card key={plan.id} className="relative">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${plan.color}`} />
                    <CardTitle className="text-lg">{plan.name}</CardTitle>
                  </div>
                  <CardDescription className="font-medium">{plan.subtitle}</CardDescription>
                  <div className="text-2xl font-bold text-primary">{plan.price}</div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 mb-6">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="text-sm">{feature}</li>
                    ))}
                  </ul>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button className="w-full">Order Now</Button>
                    </DialogTrigger>
                    <PaymentDialog planName={plan.name} price={plan.price} />
                  </Dialog>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="6month" className="mt-6">
          <div className="text-center mb-6">
            <Badge variant="secondary" className="text-lg px-4 py-2">
              💥 Get 15% OFF on your first payment! 💸
            </Badge>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {sixMonthPlans.map((plan) => (
              <Card key={plan.id} className="relative">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${plan.color}`} />
                    <CardTitle className="text-lg">{plan.name}</CardTitle>
                  </div>
                  <CardDescription className="font-medium">{plan.subtitle}</CardDescription>
                  <div className="text-xl font-bold text-primary line-through opacity-60">
                    {plan.price}
                  </div>
                  <div className="text-lg font-bold text-green-600">
                    🎉 {plan.discountPrice}
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 mb-6">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="text-sm">{feature}</li>
                    ))}
                  </ul>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button className="w-full">Order Now</Button>
                    </DialogTrigger>
                    <PaymentDialog planName={plan.name} price={plan.discountPrice || plan.price} />
                  </Dialog>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
