import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useTheme } from '@/hooks/use-theme';
export default function SettingsPage() {
  const { isDark, toggleTheme } = useTheme();
  return (
    <div className="flex h-full items-center justify-center bg-muted/40 p-4">
      <Card className="w-full max-w-md animate-fade-in">
        <CardHeader>
          <CardTitle>Settings</CardTitle>
          <CardDescription>Manage your application settings.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <Label htmlFor="dark-mode" className="text-base">Dark Mode</Label>
              <p className="text-sm text-muted-foreground">
                Enable or disable dark theme for the application.
              </p>
            </div>
            <Switch id="dark-mode" checked={isDark} onCheckedChange={toggleTheme} />
          </div>
          <div className="flex items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <Label htmlFor="notifications" className="text-base">Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Receive notifications for new messages.
              </p>
            </div>
            <Switch id="notifications" defaultChecked disabled />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}