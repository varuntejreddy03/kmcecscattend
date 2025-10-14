import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* SEO Meta Tags */}
        <meta name="description" content="KMCE Attendance Tracker - Smart attendance management system for Keshav Memorial College of Engineering students. Track attendance, predict outcomes, and manage academic progress with AI-powered insights." />
        <meta name="keywords" content="KMCE attendance, attendance tracker, college attendance, student portal, academic management, attendance prediction, KMCE students, engineering college attendance" />
        <meta name="author" content="KMCE Attendance Tracker" />
        <meta name="robots" content="index, follow" />
        <meta name="googlebot" content="index, follow" />
        
        {/* Open Graph Meta Tags */}
        <meta property="og:title" content="KMCE Attendance Tracker - Smart Student Portal" />
        <meta property="og:description" content="Advanced attendance management system for KMCE students with AI predictions and real-time analytics." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://kmceattendance.vercel.app" />
        <meta property="og:site_name" content="KMCE Attendance Tracker" />
        <meta property="og:locale" content="en_US" />
        
        {/* Twitter Card Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="KMCE Attendance Tracker" />
        <meta name="twitter:description" content="Smart attendance management for KMCE students" />
        
        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        
        {/* Canonical URL */}
        <link rel="canonical" href="https://kmceattendance.vercel.app" />
        
        {/* Preconnect for Performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* Security Headers */}
        <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
        <meta httpEquiv="X-Frame-Options" content="DENY" />
        <meta httpEquiv="X-XSS-Protection" content="1; mode=block" />
        <meta httpEquiv="Referrer-Policy" content="strict-origin-when-cross-origin" />
        
        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": "KMCE Attendance Tracker",
              "description": "Smart attendance management system for Keshav Memorial College of Engineering students",
              "url": "https://kmceattendance.vercel.app",
              "applicationCategory": "EducationalApplication",
              "operatingSystem": "Web Browser",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD"
              },
              "provider": {
                "@type": "Organization",
                "name": "Keshav Memorial College of Engineering"
              }
            })
          }}
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}