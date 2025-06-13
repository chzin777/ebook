'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Form, FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form'
import { toast } from 'sonner'

const schema = z.object({
  fullName: z.string().min(3, 'Informe nome e sobrenome'),
  email: z.string().email({ message: 'E-mail inválido' }),
  phone: z.string().optional(),
})

type ContactFormData = z.infer<typeof schema>

export default function ContactForm() {
  const form = useForm<ContactFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      fullName: '',
      email: '',
      phone: '',
    },
  })

  const handleSubmit = async (data: ContactFormData) => {
    const [firstName, ...rest] = data.fullName.trim().split(' ')
    const lastName = rest.join(' ') || ''

    const payload = {
      firstName,
      lastName,
      email: data.email,
      phone: data.phone,
      lifecycleStage: 'lead',
      contactOwner: 'Jhionathan Vitoria',
      leadStatus: 'NEW',
      marketingContact: true,
    }

    try {
      const response = await fetch('https://r3suprimentos.app.n8n.cloud/webhook/482345e7-09d6-460d-b7ab-17a176b73f0f', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!response.ok) throw new Error('Erro ao enviar')

      toast('Ebook baixado com sucesso!')
      form.reset()

      // ⬇️ Disparar download automático do eBook
      const link = document.createElement('a')
      link.href = '/3-erros-limpeza-profissional.pdf'
      link.download = '3-erros-limpeza-profissional.pdf'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (error) {
      toast.error('Erro ao enviar formulário')
      console.error(error)
    }
  }

  return (
    <div className="flex items-center justify-center w-full px-4">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="space-y-6 w-full max-w-3xl px-4 py-16 sm:px-12 sm:py-20 lg:px-20 lg:py-24 bg-white/15 backdrop-blur-lg shadow-xl rounded-3xl text-white border border-white/50 text-base sm:text-2xl"
        >
          {/* Logo centralizada e visível */}
          <div className="relative z-10 mb-8">
            <img
              src="/images/logo.png"
              alt="Logo da R3 Suprimentos"
              className="w-40 sm:w-52 h-auto mx-auto"
            />
          </div>
          <div className="text-center font-bold text-xl sm:text-3xl">
            Preencha o formulário abaixo para desbloquear seu eBook gratuito!
          </div>

          <FormField
            name="fullName"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome e Sobrenome</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    className="h-10 text-base sm:h-14 sm:text-xl"
                    placeholder=""
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            name="email"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>E-mail</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    className="h-10 text-base sm:h-14 sm:text-xl"
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            name="phone"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Número de telefone</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    className="h-10 text-base sm:h-14 sm:text-xl"
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="w-full bg-[#219fda] text-white text-lg sm:text-xl py-4 sm:py-6"
          >
            Enviar
          </Button>
        </form>
      </Form>
    </div>
  )
}
