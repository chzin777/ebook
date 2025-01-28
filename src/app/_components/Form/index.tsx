'use client'

import z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import Container from '../Container';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const schemaForm = z.object({
    razaoSocial: z.string().min(3),
    email: z.string().email(),
    tipoPessoa: z.string(),
    cnpj: z.string(),
    inscricaoEstadual: z.string(),
    nomeFantasia: z.string(),
})


export default function FormUse() {
    const form = useForm<z.infer<typeof schemaForm>>({
        resolver: zodResolver(schemaForm),
        defaultValues: {
            razaoSocial: '',
            email: '',
            tipoPessoa: '',
            cnpj: '',
            inscricaoEstadual: '',
            nomeFantasia: '',
        }
    });

    return (
        <div className='min-h-screen my-10'>
            <Container>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit()} className='w-full border border-1-gray-200 p-10 rounded-sm shadow-lg flex flex-col gap-3'>
                        <FormField
                            control={form.control}
                            name="tipoPessoa"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel> Tipo de Pessoa </FormLabel>
                                    <FormControl>
                                        <Select value={field.value} onValueChange={(value) => field.onChange(value)}>
                                            <SelectTrigger>
                                                <SelectValue>{field.value}</SelectValue>
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Fisica">Fisica</SelectItem>
                                                <SelectItem value="Juridica">Juridica</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="cnpj"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel> CNPJ </FormLabel>
                                    <FormControl>
                                        <Input placeholder="CNPJ" {...field} />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="inscricaoEstadual"
                            render={({ field }) => (
                                <FormItem className='flex flex-col'>
                                    <FormLabel> Inscrição Estadual</FormLabel>
                                    <small className='text-gray-400 text-xs leading-none'>Isento para Pessoa Fisica</small>
                                    <FormControl>
                                        <Input placeholder="Inscrição Estadual" {...field} />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <FormField 
                            control={form.control}
                            name="nomeFantasia"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel> Nome Fantasia </FormLabel>
                                    <FormControl>
                                        <Input placeholder="Nome Fantasia" {...field} />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="razaoSocial"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel> Razão Social </FormLabel>
                                    <FormControl>
                                        <Input placeholder="Razão Social" {...field} />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel> Email </FormLabel>
                                    <FormControl>
                                        <Input placeholder="Email" {...field} />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                    </form>
                </Form>
            </Container>
        </div>
    )
}