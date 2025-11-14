import { useBodyworkStore } from "@/stores/bodywork"
import { useBrandsStore } from "@/stores/brands"
import { useCarsStore } from "@/stores/cars"
import { useRankedCars } from "@/stores/rankedCars"
import { useUser } from "@/stores/user"

interface LoginInterface {
    name?: string,
    password: string,
    email: string
    role?: string
}

export const Login = async ({ password, email }: LoginInterface) => {
    try {
        const response = await fetch('/api/login', {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ password, email })
        })

        if (!response.ok) {
            throw new Error('Erro ao realizar login')
        }

        const data = await response.json()

        return data
    } catch (error) {
        console.log(error)
        throw new Error('erro interno')
    }
}

export const Register = async ({ password, email, name, role }: LoginInterface) => {
    try {
        const response = await fetch('/api/register', {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ password, email, name, role })
        })

        if (!response.ok) {
            throw new Error('Erro ao realizar registro')
        }

        const data = await response.json()

        await GetAllUsers()

        return data
    } catch (error) {
        console.log(error)
        throw new Error('erro interno')
    }
}

export const GetCars = async () => {
    try {
        const response = await fetch('/api/cars', {
            method: "POST",
            headers: { "Content-Type": "application/json" },
        })

        if (!response.ok) {
            throw new Error('Erro ao buscar os carros')
        }

        const data = await response.json()

        useCarsStore.cars = data

        return data
    } catch (error) {
        console.log(error)
        throw new Error('Erro não identificado')
    }
}

export const GetRankedCars = async () => {
    try {
        const response = await fetch('/api/ranked-cars/get-ranked-cars', {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
        })

        if (!response.ok) {
            throw new Error('erro ao pegar rank de carros')
        }

        const data = await response.json()

        useRankedCars.rank = data

        return data
    } catch (error) {
        console.log(error)
    }
}

export const CreateCarOnRank = async (car_id: string) => {
    try {
        const response = await fetch('/api/ranked-cars/add-car', {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ car_id })
        })

        if (!response.ok) {
            throw new Error('erro ao adicionar carro no rank')
        }

        const data = await response.json()

        await GetRankedCars()

        return data
    } catch (error) {
        console.log(error)
    }
}

export const DeleteCarOnRank = async (carId: string) => {
    try {
        const response = await fetch('/api/ranked-cars/remove-car', {
            method: "DELETE",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ carId })
        })

        if (!response.ok) {
            throw new Error('erro ao remover carro no rank')
        }

        const data = await response.json()

        await GetRankedCars()

        return data
    } catch (error) {
        console.log(error)
    }
}

export const GetAllUsers = async () => {
    try {
        const response = await fetch('/api/all-users', {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
        })

        if (!response.ok) {
            throw new Error('Erro na busca dos usuários')
        }

        const data = await response.json()

        useUser.all_users = data

        return data
    } catch (error) {
        console.log(error)
    }
}

export const DeleteUser = async (id: string) => {
    try {
        const response = await fetch('/api/all-users', {
            method: 'DELETE',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id })
        })

        if (!response.ok) {
            throw new Error('Erro na busca dos usuários')
        }

        const data = await response.json()

        await GetAllUsers()

        return data
    } catch (error) {
        console.log(error)
    }
}

export const EditUser = async (userData: { password: string, email: string, name: string, id: string, role: string }) => {
    try {
        const response = await fetch('/api/edit-user', {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ password: userData.password, email: userData.email, name: userData.name, id: userData.id, role: userData.role })
        })

        if (!response.ok) {
            throw new Error('Erro ao realizar registro')
        }

        const data = await response.json()

        await GetAllUsers()

        return data
    } catch (error) {
        console.log(error)
        throw new Error('erro interno')
    }
}

export async function createCar(carData: any) {
    try {
        const res = await fetch(`/api/create-car`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(carData),
        });

        if (!res.ok) {
            throw new Error("Erro ao criar carro");
        }

        const data = await res.json()

        await GetCars()

        return data
    } catch (error) {
        console.error("❌ Erro em createCar:", error);
        throw error;
    }
}

export async function deleteCar(id: string) {
    try {
        const res = await fetch(`/api/cars`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ id }),
        })

        if (!res.ok) {
            throw new Error("Erro ao deletar carro")
        }

        const data = await res.json()

        await GetCars()

        return data
    } catch (error) {
        console.error("❌ Erro em deleteCar:", error)
        throw error
    }
}

export async function updateCar(id: string, carData: any) {
    console.log(carData.bodyworkId)
    try {
        const res = await fetch(`/api/cars`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ id, carData }),
        })

        if (!res.ok) {
            throw new Error("Erro ao atualizar carro")
        }

        const data = await res.json()

        await GetCars()

        return data
    } catch (error) {
        console.error("❌ Erro em updateCar:", error)
        throw error
    }
}

export async function createBrand(brand_name: string, logo: string) {
    try {
        const response = await fetch('/api/brands/register-brand', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                logo,
                brand_name
            })

        })

        if (!response.ok) {
            throw new Error('Erro ao criar marca')
        }

        const data = await response.json()

        await getBrands()

        return data
    } catch (error) {
        console.log(error)
    }
}

export async function getBrands() {
    try {
        const response = await fetch('/api/brands/get-brands', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        })

        if (!response.ok) {
            throw new Error('erro ao carregar as marcas')
        }

        const data = await response.json()

        useBrandsStore.brands = data

        return data
    } catch (error) {
        console.log(error)
    }
}

export async function deleteBrands(id: string) {
    try {
        const response = await fetch('/api/brands/remove-brand', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id })
        })

        if (!response.ok) {
            throw new Error('erro ao carregar as marcas')
        }

        const data = await response.json()

        await getBrands()

        return data
    } catch (error) {
        console.log(error)
    }
}

export async function getBodyworks() {
    try {
        const response = await fetch('/api/bodywork/get-bodyworks', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        })

        if (!response.ok) {
            throw new Error('erro ao carregar as marcas')
        }

        const data = await response.json()

        useBodyworkStore.bodyworks = data

        return data
    } catch (error) {
        console.log(error)
    }
}

export async function createBodywork(body_data: { name: string, image_url: string }) {
    try {
        const response = await fetch('/api/bodywork/create-bodywork', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({...body_data})
        })

        if(!response.ok){
            throw new Error('erro ao criar carroceria')
        }

        const data = await response.json()

        await getBodyworks()
        
        return data;
    } catch (error) {
        console.log(error)
    }
}

export async function deleteBodywork(id: string) {
    try {
        const response = await fetch('/api/bodywork/delete-bodywork', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({id})
        })

        if(!response.ok){
            throw new Error('erro ao criar carroceria')
        }

        const data = await response.json()

        await getBodyworks()

        return data;
    } catch (error) {
        console.log(error)
    }
}