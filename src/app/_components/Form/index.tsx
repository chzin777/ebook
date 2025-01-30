'use client'

import z, { late } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import Container from '../Container';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { opstionsPraca } from '@/lib/praca';
import { atividade } from '@/lib/atividade';
import { InputField } from '../FormFild';
import { toast } from 'sonner';


const schemaForm = z.object({
    razaoSocial: z.string().min(3),
    email: z.string().email(),
    emailNfe: z.string().email(),
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
    businessPhone: z.string(),
    billingPhone: z.string(),
    enderecoEnt: z.string(),

    documento: z.string(),
    codRCA: z.string(),

    praca: z.string(),
    atividade: z.string(),

    deliveryAdressTrue: z.string(),
    deliveryZipCodeTrue: z.string(),
    deliveryDistrictTrue: z.string(),
    deliveryCityTrue: z.string(),
    deliveryAdressNumberTrue: z.string(),
    complementDeliveryAddressTrue: z.string(),

});

type FormValues = z.infer<typeof schemaForm>;

export default function FormUse() {


    const [showDeliveryFields, setShowDeliveryFields] = useState(false);
    const [sameAddress, setSameAddress] = useState<string | null>(null);
    const [personType, setPersonType] = useState('');


    const handleSubmit = async (data: FormValues) => {
        console.log(data);
        
        try {
            const response = await fetch('https://r3suprimentos.app.n8n.cloud/webhook-test/ac3d846a-eba7-4930-b038-b7282626ebae', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });
            if (response.ok) {
                toast("Formulario enviado com sucesso!",{
                    description: "O Cadastro do cliente está em analise"
                });
            } else {
                console.error('Erro ao enviar dados:', response.statusText);
            }
        } catch (error) {
            console.error('Erro ao enviar dados:', error);
        }
    }


    const form = useForm<z.infer<typeof schemaForm>>({
        resolver: zodResolver(schemaForm),
        defaultValues: {
            razaoSocial: '',
            email: '',
            emailNfe: '',
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
            businessPhone: '',
            billingPhone: '',
            enderecoEnt: '',

            documento: '',
            codRCA: '',

            praca: '',
            atividade: '',

            deliveryAdressTrue: '',
            deliveryZipCodeTrue: '',
            deliveryDistrictTrue: '',
            deliveryCityTrue: '',
            deliveryAdressNumberTrue: '',
            complementDeliveryAddressTrue: '',


        }
    });

    const documentValue = form.getValues('documento');
    const tipoPessoa = form.getValues('tipoPessoa');




    const handleDeliveryAddressChange = useCallback((value: string) => {
        setSameAddress(value);
        setShowDeliveryFields(true);

        if (value === 'Sim') {
            form.setValue('deliveryAdressTrue', form.getValues('commercialAdress'));
            form.setValue('deliveryZipCodeTrue', form.getValues('commercialZipCode'));
            form.setValue('deliveryDistrictTrue', form.getValues('businessDistrict'));
            form.setValue('deliveryCityTrue', form.getValues('businessCity'));
            form.setValue('deliveryAdressNumberTrue', form.getValues('commercialAdressNumber'));
            form.setValue('complementDeliveryAddressTrue', form.getValues('complementBusinnesAddress'));
        } else {
            form.setValue('deliveryAdressTrue', '');
            form.setValue('deliveryZipCodeTrue', '');
            form.setValue('deliveryDistrictTrue', '');
            form.setValue('deliveryCityTrue', '');
            form.setValue('deliveryAdressNumberTrue', '');
            form.setValue('complementDeliveryAddressTrue', '');
        }
    }, [form]);

    const formatDocument = (value: string, type: string) => {
        const numbers = value.replace(/\D/g, '');

        if (type === 'Fisica') {
            return numbers
                .replace(/^(\d{3})(\d)/, '$1.$2')
                .replace(/^(\d{3})\.(\d{3})(\d)/, '$1.$2.$3')
                .replace(/\.(\d{3})(\d)/, '.$1-$2')
                .substring(0, 14);
        } else {
            return numbers
                .replace(/^(\d{2})(\d)/, '$1.$2')
                .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
                .replace(/\.(\d{3})(\d)/, '.$1/$2')
                .replace(/(\d{4})(\d)/, '$1-$2')
                .substring(0, 18);
        }
    };

    const handlePersonTypeChange = (value: string) => {
        setPersonType(value);
        form.setValue('tipoPessoa', value);
        form.setValue('documento', '');
    };



    useEffect(() => {
        const controller = new AbortController();
        const signal = controller.signal;

        const fetchData = async () => {

            if (tipoPessoa !== "Juridica") return;

            const cleanCnpj = documentValue.replace(/\D/g, '');


            if (cleanCnpj.length !== 14) return;

            try {
                const response = await fetch(`https://api.cnpja.com/office/${cleanCnpj}?maxAge=1&registrations=BR`, {
                    signal,
                    headers: {
                        "Authorization": "f7568ad8-0d63-4106-bbe2-b39335374562-3ccfe766-bc6e-478b-b924-2913001e2129",
                        "Accept": "application/json"
                    }
                });

                if (!response.ok) {
                    console.log('CNPJ não encontrado ou serviço indisponível');
                    return;
                }

                const data = await response.json();

                const safeValue = (value: any, defaultValue = '') => {
                    return value !== undefined && value !== null ? value : defaultValue;
                };

                const address = data.address || {};
                const phones = Array.isArray(data.phones) ? data.phones : [];

                const formatPhone = (phones: any) => {
                    if (!phones) return '';
                    const area = safeValue(phones.area);
                    const number = safeValue(phones.number);
                    return area && number ? `${area}${number}` : '';
                };


                form.setValue('razaoSocial', safeValue(data.razao_social || data.company?.name));
                form.setValue('nomeFantasia', safeValue(data.nomeFantasia || data.alias));
                form.setValue('commercialAdress', safeValue(address.street));
                form.setValue('commercialAdressNumber', safeValue(address.number));
                form.setValue('complementBusinnesAddress', safeValue(address.details));
                form.setValue('businessDistrict', safeValue(address.district));
                form.setValue('businessCity', safeValue(address.city));
                form.setValue('commercialZipCode', safeValue(address.zip));
                form.setValue('inscricaoEstadual', safeValue(data.registrations[0].number))


                if (sameAddress === 'Sim') {
                    form.setValue('deliveryAdressTrue', safeValue(address.street));
                    form.setValue('deliveryZipCodeTrue', safeValue(address.zip));
                    form.setValue('deliveryDistrictTrue', safeValue(address.district));
                    form.setValue('deliveryCityTrue', safeValue(address.city));
                    form.setValue('deliveryAdressNumberTrue', safeValue(address.number));
                    form.setValue('complementDeliveryAddressTrue', safeValue(address.details));
                }

                const mainPhone = phones[0];
                if (mainPhone) {
                    form.setValue('businessPhone', formatPhone(mainPhone));
                }

                const billingPhone = phones[1];
                if (billingPhone) {
                    form.setValue('billingPhone', formatPhone(billingPhone));
                }

            } catch (error) {
                console.error('Erro ao buscar dados do CNPJ:', error);
                const fieldsToReset: Array<keyof FormValues> = [
                    'razaoSocial',
                    'nomeFantasia',
                    'commercialAdress',
                    'commercialAdressNumber',
                    'complementBusinnesAddress',
                    'businessDistrict',
                    'businessCity',
                    'commercialZipCode',
                    'businessPhone',
                    'billingPhone'
                ];

                fieldsToReset.forEach(field => form.setValue(field, ''));
            }
        };

        const debouncer = setTimeout(fetchData, 500);
        return () => {
            controller.abort();
            clearTimeout(debouncer);
        };
    }, [documentValue, tipoPessoa, sameAddress, form]);

    return (
        <div className='min-h-screen my-10'>
            <Container>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className='w-full border border-1-gray-200 p-10 rounded-sm shadow-lg flex flex-col gap-3'>
                        <div className='mb-10 flex flex-col items-center justify-center gap-10'>
                            <Image src={"/PLANO_DE_HIGIENE.png"} width={1920} height={200} alt='Banner' className='shadow-lg rounded-sm' />
                            <h1 className='font-semibold text-xl'>FORMULÁRIO PARA CADASTRO</h1>
                        </div>
                        <FormField
                            control={form.control}
                            name="tipoPessoa"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Tipo de Pessoa</FormLabel>
                                    <FormControl>
                                        <Select
                                            value={field.value}
                                            onValueChange={handlePersonTypeChange}
                                        >
                                            <SelectTrigger>
                                                <SelectValue>{field.value || 'Selecione o tipo'}</SelectValue>
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Fisica">Física</SelectItem>
                                                <SelectItem value="Juridica">Jurídica</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="documento"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{personType === 'Fisica' ? 'CPF' : 'CNPJ'}</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            placeholder={personType === 'Fisica' ? '000.000.000-00' : '00.000.000/0000-00'}
                                            onChange={(e) => {
                                                const formatted = formatDocument(e.target.value, personType);
                                                field.onChange(formatted);
                                            }}
                                            maxLength={personType === 'Fisica' ? 14 : 18}
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
                                    <small className='text-gray-400 text-xs leading-none'>Isento para CPF não Contribuinte</small>
                                    <FormControl>
                                        <Input placeholder="Inscrição Estadual" {...field} />
                                    </FormControl>
                                </FormItem>
                            )}
                        />

                        <InputField control={form.control} name={`nomeFantasia`} label="Nome Fantasia" placeholder="Nome Fantasia" />
                        
                        <InputField control={form.control} name={`razaoSocial`} label="Razão Social" placeholder="Razão Social" />

                        <InputField control={form.control} name={`commercialAdress`} label="Endereço Comercial" placeholder="Endereço Comercial" />    

                        <InputField control={form.control} name={`commercialAdressNumber`} label="Número" placeholder="Número" />    
                       
                        <InputField control={form.control} name={`complementBusinnesAddress`} label="Complemento" placeholder="Complemento" />    
                        
                        <InputField control={form.control} name={`businessDistrict`} label="Bairro" placeholder="Bairro" />    
                        
                        <InputField control={form.control} name={`businessCity`} label="Cidade" placeholder="Cidade" />    
                        
                        <InputField control={form.control} name={`commercialZipCode`} label="CEP" placeholder="CEP" />    
                        
                        {/* <InputField control={form.control} name={`businessPhone`} label="Telefone" placeholder="Telefone" />    
                        
                        <InputField control={form.control} name={`billingPhone`} label="Telefone" placeholder="Telefone" /> */}
                        
                        <FormField
                            control={form.control}
                            name="enderecoEnt"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>O Endereço de entrega é o mesmo do Endereço Comercial?</FormLabel>
                                    <FormControl>
                                        <Select
                                            value={field.value}
                                            onValueChange={(value) => {
                                                field.onChange(value);
                                                handleDeliveryAddressChange(value);
                                            }}
                                        >
                                            <SelectTrigger>
                                                <SelectValue>
                                                    {field.value || 'Selecione uma opção'}
                                                </SelectValue>
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value='Sim'>Sim</SelectItem>
                                                <SelectItem value='Nao'>Não</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        {showDeliveryFields && (
                            <div className="flex flex-col gap-3 border border-1-green-100 p-10 rounded-sm shadow-sm">
                                <div className='mx-auto'>
                                    <h2 className='font-semibold text-xl'>ENDERAÇO DE ENTREGA</h2>
                                </div>

                                <InputField control={form.control} name={`deliveryAdressTrue`} label="Endereço de Entrega" placeholder="Endereço de Entrega" />  

                                <InputField control={form.control} name={`deliveryAdressNumberTrue`} label="Numero" placeholder="Numero" />

                                <InputField control={form.control} name={`complementDeliveryAddressTrue`} label="Complemento" placeholder="Complemento" />

                                <InputField control={form.control} name={`deliveryDistrictTrue`} label="Bairro" placeholder="Bairro" />  

                                <InputField control={form.control} name={`deliveryCityTrue`} label="Cidade" placeholder="Cidade" />

                                <InputField control={form.control} name={`deliveryZipCodeTrue`} label="CEP" placeholder="CEP" />
                                
                            </div>
                        )}

                        <InputField control={form.control} name={`email`} label="Email" placeholder="Email" />

                        <InputField control={form.control} name={`emailNfe`} label="Email NFE" placeholder="Email NFE" />

                        <InputField control={form.control} name={`codRCA`} label="Código do RCA" placeholder="Código do RCA" />

                        <FormField
                            control={form.control}
                            name="praca"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Praça do Cliente</FormLabel>
                                    <FormControl>
                                        <Select
                                            value={field.value}
                                            onValueChange={field.onChange}
                                        >
                                            <SelectTrigger>
                                            <SelectValue placeholder="Selecione a Praça">
                                                    {field.value ? opstionsPraca.find(a => a.value === field.value)?.label : 'Praça do Cliente'}
                                                </SelectValue>
                                            </SelectTrigger>
                                            <SelectContent>
                                                {opstionsPraca.map((option) => (
                                                    <SelectItem key={option.value} value={option.value}>
                                                        {option.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="atividade"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Ramo de Atividade</FormLabel>
                                    <FormControl>
                                        <Select
                                            value={field.value}
                                            onValueChange={field.onChange}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Selecione o ramo de atividade">
                                                    {field.value ? atividade.find(a => a.value === field.value)?.label : 'Ramo de Atividade '}
                                                </SelectValue>
                                            </SelectTrigger>
                                            <SelectContent>
                                                {atividade.map((option) => (
                                                    <SelectItem key={option.value} value={option.value}>
                                                        {option.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                </FormItem>
                            )}
                        />

                        <Button
                            type="submit"
                            className="w-[400px] mt-8 bg-blue-400 hover:bg-blue-500 mx-auto"
                            disabled={form.formState.isSubmitting}
                        >
                            {form.formState.isSubmitting ? 'Enviando...' : 'Enviar'}
                        </Button>
                        
                    </form>
                </Form>
            </Container>
        </div>
    )
}