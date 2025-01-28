'use client'

import z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import Container from '../Container';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useEffect } from 'react';

const schemaForm = z.object({
    razaoSocial: z.string().min(3),
    email: z.string().email(),
    tipoPessoa: z.string(),
    cnpj: z.string(),
    inscricaoEstadual: z.string(),
    nomeFantasia: z.string(),
    commercialAdress: z.string(),
    commercialZipCode: z.string(),
    businessDistrict: z.string(),
    businessCity: z.string(),
    commercialAdressNumber: z.string(),
    complementBusinnesAddress: z.string(),

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
            commercialAdress: '',
            commercialZipCode: '',
            businessDistrict: '',
            businessCity: '',
            commercialAdressNumber: '',
            complementBusinnesAddress: '',

        }
    });

    const cnpjValue = form.getValues('cnpj');
    const tipoPessoa = form.getValues('tipoPessoa');

    useEffect(() => {
        const controller = new AbortController();
        const signal = controller.signal;

        const fetchData = async () => {
            const cleanCnpj = cnpjValue.replace(/\D/g, '');
            
            if (cleanCnpj.length !== 14 && tipoPessoa !== "Juridica") return;

            try {
                const response = await fetch(`https://api.cnpja.com/office/${cleanCnpj}`, {
                    signal,
                    headers: {
                        "Authorization": "f7568ad8-0d63-4106-bbe2-b39335374562-3ccfe766-bc6e-478b-b924-2913001e2129",
                        "Accept": "application/json"
                    }
                });

                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

                const data = await response.json();
                form.setValue('razaoSocial', data.razao_social || data.company.name);
                form.setValue('inscricaoEstadual', data.inscricao_estadual || data.IE);
                form.setValue('nomeFantasia', data.nomeFantasia || data.alias );
                form.setValue('commercialAdress', data.commercialAdress || data.address.street);
                form.setValue('commercialAdressNumber', data.commercialAdressNumber || data.address.number);
                form.setValue('complementBusinnesAddress', data.complementBusinnesAddress || data.address.details);
                form.setValue('businessDistrict', data.businessDistrict || data.address.district);
                form.setValue('businessCity', data.businessCity || data.address.city);
                form.setValue('commercialZipCode', data.commercialZipCode || data.address.zip)

            } catch (error) {
                // if (error.name !== 'AbortError') {
                //     console.error("Erro na consulta:", error);
                // }
            }
        };

        const debouncer = setTimeout(fetchData, 500);
        return () => {
            controller.abort();
            clearTimeout(debouncer);
        };
    }, [cnpjValue]);

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
                                        <Input
                                            {...field}
                                            placeholder="00.000.000/0000-00"
                                            onChange={(e) => {
                                                const rawValue = e.target.value.replace(/\D/g, '');
                                                const formatted = rawValue
                                                    .replace(/^(\d{2})(\d)/, '$1.$2')
                                                    .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
                                                    .replace(/\.(\d{3})(\d)/, '.$1/$2')
                                                    .replace(/(\d{4})(\d)/, '$1-$2');
                                                field.onChange(formatted.substring(0, 18));
                                            }}
                                            maxLength={18}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="inscricaoEstadual"
                            render={({ field }) => (
                                <FormItem className='flex flex-col'>
                                    <FormLabel> Inscrição Estadual</FormLabel>
                                    <small className='text-gray-400 text-xs leading-none'>Isento para Pessoa Fisica</small>
                                    <FormControl>
                                        <Input placeholder="Inscrição Estadual" {...field} />
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
                                    <FormLabel> Razão Social </FormLabel>
                                    <FormControl>
                                        <Input placeholder="Razão Social" {...field} />
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
                        <FormField 
                            control={form.control}
                            name="commercialAdress"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Endereço Comercial</FormLabel>
                                    <FormControl>
                                        <Input placeholder='Endereço Comercial' {...field} />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <FormField 
                            control={form.control}
                            name="commercialAdressNumber"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Número</FormLabel>
                                    <FormControl>
                                        <Input placeholder='Número' {...field} />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="complementBusinnesAddress"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Complemento</FormLabel>
                                    <FormControl>
                                        <Input placeholder='Complemento' {...field} />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <FormField 
                            control={form.control}
                            name="businessDistrict"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Bairro</FormLabel>
                                    <FormControl>
                                        <Input placeholder='Bairro' {...field} />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <FormField 
                            control={form.control}
                            name="businessCity"
                            render={({ field }) =>(
                                <FormItem>
                                    <FormLabel>Cidade</FormLabel>
                                    <FormControl>
                                        <Input placeholder='Cidade' {...field} />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <FormField 
                            control={form.control}
                            name="commercialZipCode"
                            render={({ field }) =>(
                                <FormItem>
                                    <FormLabel>Código Postal</FormLabel>
                                    <FormControl>
                                        <Input placeholder='Código Postal' {...field} />
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