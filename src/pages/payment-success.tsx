"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { SEO } from "@/components/seo";
import { useClientOnly } from "@/hooks/use-client-only";
import { LoginModal } from "@/components/login-modal";
import { AuthService } from "@/lib/auth-service";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
  CheckCircle,
  Download,
  Mail,
  ArrowRight,
  Calendar,
  CreditCard,
  Shield,
  Clock,
} from "lucide-react";

interface PaymentDetails {
  transactionId: string;
  amount: number;
  currency: string;
  timestamp: Date;
  paymentMethod: string;
  orderId: string;
  description: string;
}

export default function PaymentSuccessPage() {
  const router = useRouter();
  const isClient = useClientOnly();
  const { toast } = useToast();
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails | null>(
    null
  );
  const [isDownloading, setIsDownloading] = useState(false);
  const [isEmailSending, setIsEmailSending] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    if (isClient) {
      // Mock payment details - in real app, this would come from props or API
      const mockPayment: PaymentDetails = {
        transactionId: `TXN${Date.now()}`,
        amount: 2999,
        currency: "INR",
        timestamp: new Date(),
        paymentMethod: "**** 3456",
        orderId: `ORD${Date.now()}`,
        description: "Trip Planning Service - Premium Package",
      };

      setPaymentDetails(mockPayment);
    }
  }, [isClient]);

  const handleDownloadReceipt = () => {
    setIsDownloading(true);
    // Simulate download
    setTimeout(() => {
      setIsDownloading(false);
      // In real app, trigger actual PDF download
      toast({
        title: "✅ Receipt Downloaded",
        description: "Your receipt has been downloaded successfully!",
      });
    }, 2000);
  };

  const handleSendEmail = () => {
    setIsEmailSending(true);
    // Simulate email sending
    setTimeout(() => {
      setIsEmailSending(false);
      toast({
        title: "✅ Email Sent",
        description: "Receipt has been sent to your email!",
      });
    }, 2000);
  };

  const handleContinueToApp = () => {
    router.push("/");
  };

  // Check authentication status
  useEffect(() => {
    if (isClient) {
      const isAuth = AuthService.isAuthenticated();
      setIsAuthenticated(isAuth);

      // Show login modal if not authenticated
      if (!isAuth) {
        setShowLoginModal(true);
      }
    }
  }, [isClient]);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    setShowLoginModal(false);
  };

  const handleLoginModalClose = () => {
    // If user closes modal without logging in, redirect to home
    if (!AuthService.isAuthenticated()) {
      router.push("/");
    }
  };

  // Show loading state during hydration, auth check, or payment details loading
  if (!isClient || isAuthenticated === null || !paymentDetails) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2F80ED]"></div>
      </div>
    );
  }

  // Show login modal if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-slate-900 dark:to-slate-800">
        <LoginModal
          isOpen={showLoginModal}
          onClose={handleLoginModalClose}
          onSuccess={handleLoginSuccess}
        />
      </div>
    );
  }

  return (
    <>
      <SEO
        title="Payment Successful - Roxy AI"
        description="Your payment has been processed successfully. Your travel booking is confirmed. Thank you for choosing Roxy AI for your travel planning."
        canonical="https://tripcraft.debmalya.in/payment-success"
      />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <div className="bg-white dark:bg-slate-800 shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-[#2F80ED] to-[#56CCF2] rounded-full">
                <CheckCircle className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Payment Successful
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Your transaction has been completed
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-[#2F80ED]" />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Secure Payment
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Success Message */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-[#2F80ED] to-[#56CCF2] rounded-full mb-6">
            <CheckCircle className="h-12 w-12 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Payment Successful!
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Thank you for your purchase. Your payment has been processed
            successfully.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Payment Details */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CreditCard className="h-5 w-5" />
                  <span>Transaction Details</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Transaction ID
                      </label>
                      <p className="text-sm font-mono bg-gray-100 dark:bg-gray-800 p-2 rounded">
                        {paymentDetails.transactionId}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Order ID
                      </label>
                      <p className="text-sm font-mono bg-gray-100 dark:bg-gray-800 p-2 rounded">
                        {paymentDetails.orderId}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Payment Method
                      </label>
                      <p className="text-sm font-mono bg-gray-100 dark:bg-gray-800 p-2 rounded">
                        {paymentDetails.paymentMethod}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Amount Paid
                      </label>
                      <p className="text-2xl font-bold bg-gradient-to-r from-[#2F80ED] to-[#56CCF2] bg-clip-text text-transparent">
                        ₹{paymentDetails.amount.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Date & Time
                      </label>
                      <p className="text-sm bg-gray-100 dark:bg-gray-800 p-2 rounded">
                        {paymentDetails.timestamp.toLocaleDateString()} at{" "}
                        {paymentDetails.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Status
                      </label>
                      <div>
                        <Badge className="bg-gradient-to-r from-[#2F80ED] to-[#56CCF2] text-white">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Completed
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Description
                  </label>
                  <p className="text-sm bg-gray-100 dark:bg-gray-800 p-3 rounded mt-1">
                    {paymentDetails.description}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* What's Next */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5" />
                  <span>What&apos;s Next?</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                      <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">
                        1
                      </span>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        Access Your Account
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Your premium features are now active. You can start
                        planning your trips immediately.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                      <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">
                        2
                      </span>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        Receive Confirmation Email
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        A detailed receipt and account information will be sent
                        to your email address.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                      <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">
                        3
                      </span>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        Start Planning
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Begin creating your personalized travel itinerary with
                        AI assistance.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Action Panel */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Receipt Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  onClick={handleDownloadReceipt}
                  disabled={isDownloading}
                  className="w-full"
                  variant="outline"
                >
                  {isDownloading ? (
                    <>
                      <Clock className="mr-2 h-4 w-4 animate-spin" />
                      Downloading...
                    </>
                  ) : (
                    <>
                      <Download className="mr-2 h-4 w-4" />
                      Download Receipt
                    </>
                  )}
                </Button>
                <Button
                  onClick={handleSendEmail}
                  disabled={isEmailSending}
                  className="w-full"
                  variant="outline"
                >
                  {isEmailSending ? (
                    <>
                      <Clock className="mr-2 h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Mail className="mr-2 h-4 w-4" />
                      Email Receipt
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button onClick={handleContinueToApp} className="w-full">
                  <ArrowRight className="mr-2 h-4 w-4" />
                  Continue to App
                </Button>
                <Button
                  onClick={() => router.push("/")}
                  variant="outline"
                  className="w-full"
                >
                  Go to Homepage
                </Button>
              </CardContent>
            </Card>

            {/* Support */}
            <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
              <CardContent className="pt-6">
                <h3 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
                  Need Help?
                </h3>
                <p className="text-sm text-blue-800 dark:text-blue-200 mb-4">
                  Our support team is here to help you with any questions.
                </p>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center space-x-2 text-blue-700 dark:text-blue-300">
                    <Mail className="h-4 w-4" />
                    <span>support@tripai.com</span>
                  </div>
                  <div className="flex items-center space-x-2 text-blue-700 dark:text-blue-300">
                    <Clock className="h-4 w-4" />
                    <span>24/7 Support</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            This transaction was processed securely by Razorpay.
            <br />
            Your payment information is encrypted and protected.
          </p>
        </div>
      </div>

      {/* Login Modal */}
      <LoginModal
        isOpen={showLoginModal}
        onClose={handleLoginModalClose}
        onSuccess={handleLoginSuccess}
      />
      </div>
    </>
  );
}
