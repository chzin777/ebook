

export default function getDataEnterprise(cnpj: string) {

    try{

        const response = fetch (`https://api.cnpja.com/office/${cnpj}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer f7568ad8-0d63-4106-bbe2-b39335374562-3ccfe766-bc6e-478b-b924-2913001e2129' 
            }
        })
        
    } catch (error) {
        console.log(error)   
    }

}