import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Настройки</h1>
        <p className="text-muted-foreground mt-1">Управление настройками системы и профиля</p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList>
          <TabsTrigger value="profile">Профиль</TabsTrigger>
          <TabsTrigger value="notifications">Уведомления</TabsTrigger>
          <TabsTrigger value="system">Система</TabsTrigger>
          <TabsTrigger value="sla">SLA</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Личная информация</CardTitle>
              <CardDescription>Обновите информацию о вашем профиле</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">ФИО</Label>
                  <Input id="fullName" defaultValue="Администратор Системы" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" defaultValue="admin@stilt.com" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Телефон</Label>
                  <Input id="phone" defaultValue="+7 (900) 123-45-67" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Роль</Label>
                  <Input id="role" defaultValue="Администратор" disabled />
                </div>
              </div>
              <Button>Сохранить изменения</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Безопасность</CardTitle>
              <CardDescription>Управление паролем и безопасностью аккаунта</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Текущий пароль</Label>
                <Input id="currentPassword" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="newPassword">Новый пароль</Label>
                <Input id="newPassword" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Подтвердите пароль</Label>
                <Input id="confirmPassword" type="password" />
              </div>
              <Button>Изменить пароль</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Настройки уведомлений</CardTitle>
              <CardDescription>Управление способами получения уведомлений</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Email уведомления</Label>
                  <p className="text-sm text-muted-foreground">Получать уведомления на email</p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Новые заявки</Label>
                  <p className="text-sm text-muted-foreground">Уведомления о новых заявках</p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Назначенные заявки</Label>
                  <p className="text-sm text-muted-foreground">Уведомления о назначенных вам заявках</p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Просроченные SLA</Label>
                  <p className="text-sm text-muted-foreground">Уведомления о просроченных заявках</p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Комментарии</Label>
                  <p className="text-sm text-muted-foreground">Уведомления о новых комментариях</p>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Системные настройки</CardTitle>
              <CardDescription>Общие настройки системы Service Desk</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="timezone">Часовой пояс</Label>
                <Input id="timezone" defaultValue="Europe/Moscow (UTC+3)" />
              </div>
              <Separator />
              <div className="space-y-2">
                <Label htmlFor="language">Язык интерфейса</Label>
                <Input id="language" defaultValue="Русский" />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Автоматическое назначение</Label>
                  <p className="text-sm text-muted-foreground">Автоматически назначать заявки инженерам</p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Skill-based routing</Label>
                  <p className="text-sm text-muted-foreground">Маршрутизация на основе навыков инженеров</p>
                </div>
                <Switch defaultChecked />
              </div>
              <Button>Сохранить настройки</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sla" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Управление SLA</CardTitle>
              <CardDescription>Настройка соглашений об уровне обслуживания</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="font-semibold">Критический приоритет</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="criticalResponse">Время ответа (мин)</Label>
                    <Input id="criticalResponse" type="number" defaultValue="15" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="criticalResolve">Время решения (ч)</Label>
                    <Input id="criticalResolve" type="number" defaultValue="4" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="criticalEscalation">Эскалация (мин)</Label>
                    <Input id="criticalEscalation" type="number" defaultValue="30" />
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="font-semibold">Высокий приоритет</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="highResponse">Время ответа (мин)</Label>
                    <Input id="highResponse" type="number" defaultValue="30" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="highResolve">Время решения (ч)</Label>
                    <Input id="highResolve" type="number" defaultValue="8" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="highEscalation">Эскалация (ч)</Label>
                    <Input id="highEscalation" type="number" defaultValue="1" />
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="font-semibold">Средний приоритет</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="mediumResponse">Время ответа (ч)</Label>
                    <Input id="mediumResponse" type="number" defaultValue="2" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="mediumResolve">Время решения (ч)</Label>
                    <Input id="mediumResolve" type="number" defaultValue="24" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="mediumEscalation">Эскалация (ч)</Label>
                    <Input id="mediumEscalation" type="number" defaultValue="4" />
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="font-semibold">Низкий приоритет</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="lowResponse">Время ответа (ч)</Label>
                    <Input id="lowResponse" type="number" defaultValue="8" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lowResolve">Время решения (ч)</Label>
                    <Input id="lowResolve" type="number" defaultValue="72" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lowEscalation">Эскалация (ч)</Label>
                    <Input id="lowEscalation" type="number" defaultValue="24" />
                  </div>
                </div>
              </div>

              <Button>Сохранить SLA настройки</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
