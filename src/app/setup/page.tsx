
"use client";

import { useState, type FormEvent } from 'react';
import { Container } from '@/components/shared/Container';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CheckCircle, ClipboardCopy, FileText, Server, Settings, Terminal } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface EnvConfig {
  GOOGLE_API_KEY: string;
  SMTP_HOST: string;
  SMTP_PORT: string;
  SMTP_USER: string;
  SMTP_PASS: string;
  SMTP_SECURE: string; // 'true' or 'false'
  EMAIL_FROM: string;
  ADMIN_EMAIL: string;
  SYSTEM_ALERT_EMAILS: string;
}

const initialEnvConfig: EnvConfig = {
  GOOGLE_API_KEY: '',
  SMTP_HOST: '',
  SMTP_PORT: '587',
  SMTP_USER: '',
  SMTP_PASS: '',
  SMTP_SECURE: 'false',
  EMAIL_FROM: '',
  ADMIN_EMAIL: '',
  SYSTEM_ALERT_EMAILS: '',
};

export default function SetupPage() {
  const [envConfig, setEnvConfig] = useState<EnvConfig>(initialEnvConfig);
  const [generatedEnvContent, setGeneratedEnvContent] = useState<string>('');
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEnvConfig(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (name: keyof EnvConfig, checked: boolean | string) => {
     if (name === 'SMTP_SECURE') {
      setEnvConfig(prev => ({ ...prev, SMTP_SECURE: checked ? 'true' : 'false' }));
    }
  };

  const generateEnvFileContent = () => {
    const content = Object.entries(envConfig)
      .map(([key, value]) => `${key}=${value}`)
      .join('\n');
    setGeneratedEnvContent(content);
    toast({ title: ".env Content Generated", description: "You can now copy the content below." });
  };

  const copyToClipboard = () => {
    if (generatedEnvContent) {
      navigator.clipboard.writeText(generatedEnvContent)
        .then(() => {
          toast({ title: "Copied to Clipboard!", description: ".env content has been copied." });
        })
        .catch(err => {
          toast({ title: "Copy Failed", description: "Could not copy content. Please try manually.", variant: "destructive" });
          console.error('Failed to copy: ', err);
        });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/10 to-background p-4 md:p-8">
      <Container>
        <Card className="max-w-3xl mx-auto shadow-2xl">
          <CardHeader className="text-center">
            <Settings className="h-16 w-16 text-primary mx-auto mb-4" />
            <CardTitle className="text-3xl md:text-4xl font-headline text-foreground">
              Application Setup Guide & Configurator
            </CardTitle>
            <CardDescription className="text-muted-foreground text-lg">
              Follow these steps to configure and deploy your portfolio application.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-10">
            {/* Section 1: Environment Variables Configuration */}
            <section id="env-config">
              <Card className="bg-card/50">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <FileText className="h-8 w-8 text-primary" />
                    <CardTitle className="text-2xl text-foreground">Environment Variables (.env)</CardTitle>
                  </div>
                  <CardDescription className="text-muted-foreground">
                    Provide the necessary details to generate your <code className="font-mono bg-muted px-1 py-0.5 rounded text-xs">.env</code> file content.
                    This file stores sensitive credentials and API keys for your server.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label htmlFor="GOOGLE_API_KEY" className="text-foreground">Google AI API Key (for Genkit)</Label>
                    <Input type="password" name="GOOGLE_API_KEY" id="GOOGLE_API_KEY" value={envConfig.GOOGLE_API_KEY} onChange={handleInputChange} placeholder="Your Google AI API Key" className="mt-1 bg-input" />
                  </div>

                  <h4 className="text-lg font-semibold text-foreground pt-2 border-t border-border mt-4">SMTP Configuration (for Sending Emails)</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="SMTP_HOST" className="text-foreground">SMTP Host</Label>
                      <Input name="SMTP_HOST" id="SMTP_HOST" value={envConfig.SMTP_HOST} onChange={handleInputChange} placeholder="e.g., smtp.mailprovider.com or relay.mailchannels.net" className="mt-1 bg-input" />
                    </div>
                    <div>
                      <Label htmlFor="SMTP_PORT" className="text-foreground">SMTP Port</Label>
                      <Input name="SMTP_PORT" id="SMTP_PORT" type="number" value={envConfig.SMTP_PORT} onChange={handleInputChange} placeholder="e.g., 587 or 465" className="mt-1 bg-input" />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="SMTP_USER" className="text-foreground">SMTP Username</Label>
                    <Input name="SMTP_USER" id="SMTP_USER" value={envConfig.SMTP_USER} onChange={handleInputChange} placeholder="Your SMTP login username" className="mt-1 bg-input" />
                  </div>
                  <div>
                    <Label htmlFor="SMTP_PASS" className="text-foreground">SMTP Password</Label>
                    <Input type="password" name="SMTP_PASS" id="SMTP_PASS" value={envConfig.SMTP_PASS} onChange={handleInputChange} placeholder="Your SMTP login password" className="mt-1 bg-input" />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="SMTP_SECURE"
                      name="SMTP_SECURE"
                      checked={envConfig.SMTP_SECURE === 'true'}
                      onCheckedChange={(checked) => handleCheckboxChange('SMTP_SECURE', checked)}
                    />
                    <Label htmlFor="SMTP_SECURE" className="text-foreground">
                      Use SSL/TLS (SMTP Secure)? (Check for port 465, uncheck for port 587/25 with STARTTLS)
                    </Label>
                  </div>
                  <div>
                    <Label htmlFor="EMAIL_FROM" className="text-foreground">Default "From" Email Address</Label>
                    <Input type="email" name="EMAIL_FROM" id="EMAIL_FROM" value={envConfig.EMAIL_FROM} onChange={handleInputChange} placeholder="e.g., no-reply@yourdomain.com" className="mt-1 bg-input" />
                    <p className="text-xs text-muted-foreground mt-1">Ensure this address is authorized by your SMTP provider.</p>
                  </div>
                  <div>
                    <Label htmlFor="ADMIN_EMAIL" className="text-foreground">Primary Admin Email (for notifications)</Label>
                    <Input type="email" name="ADMIN_EMAIL" id="ADMIN_EMAIL" value={envConfig.ADMIN_EMAIL} onChange={handleInputChange} placeholder="e.g., admin@yourdomain.com" className="mt-1 bg-input" />
                  </div>
                  <div>
                    <Label htmlFor="SYSTEM_ALERT_EMAILS" className="text-foreground">System Alert Emails (comma-separated, for critical failures)</Label>
                    <Input name="SYSTEM_ALERT_EMAILS" id="SYSTEM_ALERT_EMAILS" value={envConfig.SYSTEM_ALERT_EMAILS} onChange={handleInputChange} placeholder="e.g., alert1@example.com,alert2@example.com" className="mt-1 bg-input" />
                  </div>

                  <Button onClick={generateEnvFileContent} className="w-full mt-4">
                    <FileText className="mr-2 h-5 w-5" /> Generate .env Content
                  </Button>

                  {generatedEnvContent && (
                    <div className="mt-6 space-y-3">
                      <Label htmlFor="generated-env" className="text-foreground text-md">Generated .env File Content:</Label>
                       <Alert variant="default" className="bg-primary/10 border-primary/30">
                        <CheckCircle className="h-5 w-5 text-primary" />
                        <AlertTitle className="font-semibold text-primary">Action Required</AlertTitle>
                        <AlertDescription className="text-foreground">
                          Create a file named <code className="font-mono bg-muted px-1 py-0.5 rounded text-xs">.env</code> in the root directory of your project on your server,
                          then copy and paste the entire content below into that file.
                        </AlertDescription>
                      </Alert>
                      <Textarea
                        id="generated-env"
                        value={generatedEnvContent}
                        readOnly
                        rows={12}
                        className="bg-input/50 font-mono text-xs border-border"
                      />
                      <Button onClick={copyToClipboard} variant="outline" className="w-full">
                        <ClipboardCopy className="mr-2 h-5 w-5" /> Copy to Clipboard
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </section>

            {/* Section 2: Deployment Steps */}
            <section id="deployment-steps">
              <Card className="bg-card/50">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <Server className="h-8 w-8 text-primary" />
                    <CardTitle className="text-2xl text-foreground">Deployment Steps</CardTitle>
                  </div>
                  <CardDescription className="text-muted-foreground">
                    General steps to deploy your Next.js application. Specifics may vary by hosting provider.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 text-muted-foreground">
                  <div className="flex items-start space-x-3">
                    <Terminal className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-foreground">1. Install Dependencies:</h4>
                      <p>On your server, navigate to the project directory and run: <code className="font-mono bg-muted px-1 py-0.5 rounded text-xs">npm install</code> or <code className="font-mono bg-muted px-1 py-0.5 rounded text-xs">yarn install</code>.</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Terminal className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-foreground">2. Create <code className="font-mono text-foreground">.env</code> File:</h4>
                      <p>Using the content generated above, create a <code className="font-mono bg-muted px-1 py-0.5 rounded text-xs">.env</code> file in the root of your project on the server.</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Terminal className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-foreground">3. Build the Project:</h4>
                      <p>Run the build command: <code className="font-mono bg-muted px-1 py-0.5 rounded text-xs">npm run build</code> or <code className="font-mono bg-muted px-1 py-0.5 rounded text-xs">yarn build</code>.</p>
                    </div>
                  </div>
                   <div className="flex items-start space-x-3">
                    <Terminal className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-foreground">4. Start the Application:</h4>
                      <p>Run the start command: <code className="font-mono bg-muted px-1 py-0.5 rounded text-xs">npm run start</code> or <code className="font-mono bg-muted px-1 py-0.5 rounded text-xs">yarn start</code>. For production, consider using a process manager like PM2.</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Settings className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-foreground">5. Hosting Environment Variables:</h4>
                      <p>
                        Most hosting platforms (Vercel, Netlify, Firebase App Hosting, AWS, etc.) provide a way to set environment variables through their dashboard or CLI.
                        This is often preferred for production deployments over a static <code className="font-mono bg-muted px-1 py-0.5 rounded text-xs">.env</code> file for better security and management.
                        Consult your hosting provider's documentation. The variable names (<code className="font-mono bg-muted px-1 py-0.5 rounded text-xs">SMTP_HOST</code>, etc.) remain the same.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Section 3: Admin Panel Configuration */}
            <section id="admin-config">
              <Card className="bg-card/50">
                <CardHeader>
                   <div className="flex items-center gap-3">
                    <CheckCircle className="h-8 w-8 text-primary" />
                    <CardTitle className="text-2xl text-foreground">Admin Panel & Content</CardTitle>
                  </div>
                  <CardDescription className="text-muted-foreground">
                    Website content (About, Services, Projects, Testimonials, Navigation, Email Templates design) is managed via the Admin Panel.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 text-muted-foreground">
                  <p>
                    Access the Admin Panel at: <a href="/donotentermetowebsitepotfolio" className="text-primary hover:underline"><code className="font-mono">/donotentermetowebsitepotfolio</code></a>.
                  </p>
                  <p>
                    Content edited in the admin panel (like "About Me" text, service descriptions, project details, etc.) is stored in your browser's <strong className="text-foreground">localStorage</strong>.
                  </p>
                  <Alert variant="default" className="bg-primary/10 border-primary/30">
                    <AlertTitle className="font-semibold text-primary">Important Note on Content</AlertTitle>
                    <AlertDescription className="text-foreground">
                      Since content is saved in localStorage, it's specific to the browser and device where you edit it.
                      To make this content "live" and default for all users, you typically need to:
                      <ol className="list-decimal list-inside ml-4 mt-1 text-sm">
                        <li>Edit and save the content in the Admin Panel.</li>
                        <li>Manually copy the updated data structures (e.g., the JavaScript arrays/objects for services, projects).</li>
                        <li>Paste this data into the corresponding variables in the <code className="font-mono bg-muted px-1 py-0.5 rounded text-xs">src/data/constants.ts</code> file in your project code.</li>
                        <li>Re-deploy your application.</li>
                      </ol>
                       This setup provides a way to manage content without a database for simpler portfolios. For multi-user editing or more complex needs, a backend database would be required.
                    </AlertDescription>
                  </Alert>
                   <Alert variant="default" className="bg-primary/10 border-primary/30 mt-4">
                    <AlertTitle className="font-semibold text-primary">Email Templates Workflow</AlertTitle>
                    <AlertDescription className="text-foreground">
                     The "Email Templates" editor in the admin panel saves your designs to localStorage. To use these templates for actual emails:
                      <ol className="list-decimal list-inside ml-4 mt-1 text-sm">
                        <li>Design your template in the admin panel and save it (to localStorage).</li>
                        <li>Copy the HTML content from the admin panel's textarea.</li>
                        <li>Paste this HTML into the corresponding string variable in the <code className="font-mono bg-muted px-1 py-0.5 rounded text-xs">src/app/actions/send-inquiry-email.ts</code> file.</li>
                        <li>Re-deploy your application.</li>
                      </ol>
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>
            </section>
          </CardContent>
          <CardFooter className="text-center">
             <p className="text-xs text-muted-foreground w-full">
              This setup guide helps you configure your application. For advanced deployment scenarios, consult your hosting provider's documentation.
            </p>
          </CardFooter>
        </Card>
      </Container>
    </div>
  );
}

    