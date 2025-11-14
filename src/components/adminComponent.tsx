"use client"
import { ArrowRight, Car, CarFront, Code2, KeySquare, MoreHorizontal, Plus, ToolCase, Trash, Trophy, User, User2, Workflow } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { useEffect, useRef, useState } from "react";
import { useForm, Controller, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { createCar, deleteCar, updateCar, DeleteUser, EditUser, GetAllUsers, GetCars, Register, getBrands, CreateCarOnRank, DeleteCarOnRank, GetRankedCars, createBrand, deleteBrands, getBodyworks, createBodywork, deleteBodywork } from "@/app/actions";
import { toast } from "sonner";
import { useSnapshot } from "valtio";
import { useUser } from "@/stores/user";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { useRouter, useSearchParams } from "next/navigation";
import { useCarsStore } from "@/stores/cars";
import { Card, CardContent, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList } from "./ui/tabs";
import { TabsTrigger } from "@radix-ui/react-tabs";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Checkbox } from "./ui/checkbox";
import { Label } from "./ui/label";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { useBrandsStore } from "@/stores/brands";
import { useRankedCars } from "@/stores/rankedCars";
import { useBodyworkStore } from "@/stores/bodywork";
import { formatMoney } from "@/app/actions/utils";

interface BrandInterface {
    cars: any[],
    logo_img: string,
    name: string,
    id: string,
}

export default function AdminComponent() {
    const [loading, setLoading] = useState(false)
    const [newUserModal, setNewUserModal] = useState(false)
    const [newCarRank, setNewCarRank] = useState(false)
    const users = useSnapshot(useUser.all_users)
    const brands = useSnapshot(useBrandsStore.brands)
    const cars = useSnapshot(useCarsStore)
    const rankCars = useSnapshot(useRankedCars)
    const [userData, setUserData] = useState({
        name: '',
        email: '',
        password: '',
        id: '',
        role: ''
    })
    const [brandData, setBrandData] = useState({
        brand_name: '',
        img_url: ''
    })
    const [userEdit, setUserEdit] = useState(false)
    const [search, setSearch] = useState("")
    const [searchCars, setSearchCars] = useState('')
    const [searchBrands, setSearchBrands] = useState('')
    const [userDeleting, setUserDeleting] = useState('')
    const [loadingPage, setLoadingPage] = useState(false)
    const [hasFetchedCars, setHasFetchedCars] = useState(false)
    const [hasFetchedUsers, setHasFetchedUsers] = useState(false)
    const searchParams = useSearchParams()
    const router = useRouter()
    const [tabCreateCar, setTabCreateCar] = useState('details')
    const [carsToShow, setCarsToShow] = useState(() => cars.cars ?? []);
    const dialogCloseRef = useRef<HTMLButtonElement>(null)
    const session = useSession().data
    const [deleteUserModal, setDeleteUserModal] = useState(false)
    const [userSelected, setUserSelected] = useState('')
    const [selectedCar, setSelectedCar] = useState("");
    const selectedBrandLabel = cars.cars.find(car => car.id.toString() === selectedCar)?.name
    const [removingCarId, setRemovingCarId] = useState('')
    const toggleDeleteBrandModal = useRef<HTMLButtonElement>(null)
    const [filteredBrands, setFilteredBrands] = useState<any[]>([])
    const bodyworkStore = useSnapshot(useBodyworkStore)
    const bodyworkRef = useRef<HTMLButtonElement>(null)

    const initialCarData = {
        name: "",
        brand: "",
        model: "",
        fipe: 0,
        year: new Date().getFullYear(),
        imageUrl: "",
        videoUrl: "",
        description: "",
        bodyworkId: "",
        popular: false,
        brandModel: "",
        specifications: {
            fuel: "GASOLINE",
            engine: "",
            power: "",
            torque: "",
            consumption: "",
            transmission: "MANUAL",
            traction: "",
            seats: 4,
            doors: 4,
            trunkCapacity: "",
            weight: "",
            maxSpeed: "",
            acceleration: ""
        },

        features: {
            airBag: false,
            absBrakes: false,
            electricWindows: false,
            airConditioning: false,
            alarm: false,
            centralLocking: false,
            powerSteering: false,
            rearCamera: false,
            bluetooth: false,
            usbPort: false,
            gps: false,
            alloyWheels: false,
            fogLights: false,
            sunroof: false
        }
    }

    const [newCarModal, setNewCarModal] = useState(false)
    const [editingCarId, setEditingCarId] = useState<string | null>(null)

    const carSchema = z.object({
        name: z.string().min(3, "Nome precisa ter pelo menos 3 caracteres"),
        brand: z.string().min(1, "Marca é obrigatória"),
        model: z.string().min(1, "Modelo é obrigatório"),
        fipe: z.preprocess((val) => {
            if (typeof val === 'string') return val === '' ? NaN : Number(val)
            return val
        }, z.number().refine((v) => !isNaN(v) && v >= 0, { message: 'FIPE inválido' })),
        year: z.preprocess(
            (val) => {
                if (typeof val === "string") return val === "" ? NaN : Number(val);
                return val;
            },
            z
                .number()
                .int()
                .min(1900, "Ano inválido")
                .max(new Date().getFullYear() + 3, "Ano muito à frente do atual")
        ),
        imageUrl: z.string().min(1, 'URL da imagem é obrigatória'),
        bodyworkId: z.string().min(1, 'Carroceria obrigatória'),
        videoUrl: z.string().min(1, 'URL do vídeo é obrigatória'),
        description: z.string().min(10, 'Descrição deve ter ao menos 10 caracteres'),
        popular: z.boolean().optional(),
        brandId: z.string().min(1, 'a marca é obrigatória'),
        specifications: z.object({
            fuel: z.string().min(1, 'Combustível é obrigatório'),
            engine: z.string().min(1, 'Motor é obrigatório'),
            power: z.string().min(1, 'Potência é obrigatória'),
            torque: z.string().min(1, 'Torque é obrigatório'),
            consumption: z.string().min(1, 'Consumo é obrigatório'),
            transmission: z.string().min(1, 'Câmbio é obrigatório'),
            traction: z.string().min(1, 'Tração é obrigatória'),
            seats: z.preprocess((v) => (typeof v === 'string' ? (v === '' ? NaN : Number(v)) : v), z.number().int().min(1, 'Assentos inválidos')),
            doors: z.preprocess((v) => (typeof v === 'string' ? (v === '' ? NaN : Number(v)) : v), z.number().int().min(1, 'Portas inválidas')),
            trunkCapacity: z.string().min(1, 'Capacidade do porta-malas é obrigatória'),
            weight: z.string().min(1, 'Peso é obrigatório'),
            maxSpeed: z.string().min(1, 'Velocidade máxima é obrigatória'),
            acceleration: z.string().min(1, 'Aceleração é obrigatória'),
        }),
        features: z.object({
            airBag: z.boolean().optional(),
            absBrakes: z.boolean().optional(),
            electricWindows: z.boolean().optional(),
            airConditioning: z.boolean().optional(),
            alarm: z.boolean().optional(),
            centralLocking: z.boolean().optional(),
            powerSteering: z.boolean().optional(),
            rearCamera: z.boolean().optional(),
            bluetooth: z.boolean().optional(),
            usbPort: z.boolean().optional(),
            gps: z.boolean().optional(),
            alloyWheels: z.boolean().optional(),
            fogLights: z.boolean().optional(),
            sunroof: z.boolean().optional(),
        }).partial().optional(),
    })

    type CarFormValues = z.infer<typeof carSchema>

    const { control, handleSubmit, setValue, reset, watch, formState: { errors, isSubmitting } } = useForm<CarFormValues>({
        resolver: zodResolver(carSchema) as unknown as Resolver<CarFormValues>,
        defaultValues: initialCarData as unknown as CarFormValues,
    })

    useEffect(() => {
        if (newCarModal && !editingCarId) reset(initialCarData as unknown as CarFormValues)
    }, [newCarModal, editingCarId, reset])

    const handleCarModalOpenChange = (open: boolean) => {
        if (!open) {
            if (editingCarId) {
                setEditingCarId(null)
                reset(initialCarData as unknown as CarFormValues)
            }
            setNewCarModal(false)
            return
        }

        setNewCarModal(true)
    }

    const onSubmit = async (data: CarFormValues) => {
        setLoading(true)
        try {
            const newCarPayload = {
                name: data.name,
                brand: data.brand,
                model: data.model || "",
                fipe: typeof data.fipe === "number" ? data.fipe : Number(data.fipe) || 0,
                year: data.year || new Date().getFullYear(),
                imageUrl: data.imageUrl || "",
                videoUrl: data.videoUrl || "",
                description: data.description || "",
                popular: data.popular,
                bodyworkId: data.bodyworkId,
                brandId: data.brandId,
                specifications: {
                    ...(data.specifications || {}),
                },
                features: {
                    ...initialCarData.features,
                    ...(data.features || {}),
                },
            }

            if (editingCarId) {
                try {
                    await updateCar(editingCarId, newCarPayload)
                    toast.success('Veículo atualizado com sucesso')
                } catch (err) {
                    console.error('Erro ao atualizar carro via API', err)
                }
            } else {
                try {
                    await createCar(newCarPayload)
                    toast.success("Veículo criado com sucesso")
                } catch (err) {
                    console.error('Erro ao criar carro via action', err)
                }
            }
        } catch (error) {
            console.error(error)
            toast.error("Erro ao processar formulário")
        } finally {
            setLoading(false)
            setNewCarModal(false)
            setEditingCarId(null)
            reset(initialCarData as unknown as CarFormValues)
        }
    }

    const handleOpenEdit = (car: any) => {
        setEditingCarId(car.id)
        const values: Partial<CarFormValues> = {
            name: car.name,
            brand: car.brand,
            model: car.model,
            fipe: car.fipe,
            year: car.year,
            imageUrl: car.imageUrl,
            videoUrl: car.videoUrl,
            description: car.description,
            popular: car.popular,
            specifications: car.specifications,
            features: car.features,
        }
        reset(values as CarFormValues)
        setNewCarModal(true)
    }

    const featureLabels: Record<string, string> = {
        airBag: "Air Bag",
        absBrakes: "Freios ABS",
        electricWindows: "Vidros Elétricos",
        airConditioning: "Ar-condicionado",
        alarm: "Alarme",
        centralLocking: "Trava Elétrica",
        powerSteering: "Direção Assistida",
        rearCamera: "Câmera de Ré",
        bluetooth: "Bluetooth",
        usbPort: "Entrada USB",
        gps: "GPS",
        alloyWheels: "Rodas de Liga Leve",
        fogLights: "Faróis de Neblina",
        sunroof: "Teto Solar",
    }


    const typeParam = searchParams.get("type")
    const [activeTab, setActiveTab] = useState("users")

    useEffect(() => {
        if (!typeParam) {
            const params = new URLSearchParams(searchParams.toString())
            params.set("type", "users")
            router.replace(`/admin?${params.toString()}`)
            setActiveTab("users")
        } else {
            setActiveTab(typeParam)
        }
    }, [typeParam])

    const handleTabChange = (tab: string) => {
        const params = new URLSearchParams(searchParams.toString())
        params.set("type", tab)
        router.push(`/admin?${params.toString()}`)
    }

    const handleRegister = async () => {
        setLoading(true)
        try {
            const response = await Register(userData)

            if (response) {
                toast.success('usuário cadastrado com sucesso')
                return
            }

            toast.error('erro ao cadastrar usuário')
        } catch (error) {
            console.log(error)
            toast.error('erro ao cadastrar usuário')
        } finally {
            setNewUserModal(false)
            setLoading(false)
        }
    }

    const handleCreateBrand = async () => {
        setLoading(true)
        try {
            const response = await createBrand(brandData.brand_name, brandData.img_url)

            if (response) {
                toast.success('marca registrada com sucesso!')
            }
        } catch (error) {
            toast.error('erro ao registrar marca')
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    const handleEditUser = async () => {
        setLoading(true)
        try {
            const response = await EditUser(userData)

            if (response) {
                toast.success('usuário editado com sucesso')
                return
            }

            toast.error('erro ao editar usuário')
        } catch (error) {
            console.log(error)
            toast.error('erro ao editar usuário')
        } finally {
            setUserEdit(false)
            setLoading(false)
        }
    }

    const fetchUsers = async () => {
        setLoadingPage(true)
        try {
            await GetAllUsers()
        } catch (error) {
            console.log(error)
            toast.error("Erro ao buscar usuários")
        } finally {
            setLoadingPage(false)
            setHasFetchedUsers(true)
        }
    }

    const fetchCars = async () => {
        setLoadingPage(true)
        try {
            await GetCars()
        } catch (error) {
            console.log(error)
            toast.error("Erro ao buscar carros")
        } finally {
            setLoadingPage(false)
            setHasFetchedCars(true)
        }
    }

    const fetchBrands = async () => {
        setLoadingPage(true)
        try {
            const response = await getBrands()
            setFilteredBrands(response)
        } catch (error) {
            console.log(error)
            toast.error("Erro ao buscar carros")
        } finally {
            setLoadingPage(false)
        }
    }

    const fetchRankedCars = async () => {
        setLoadingPage(true)
        try {
            await GetRankedCars()
        } catch (error) {
            console.log(error)
            toast.error("Erro ao buscar carros")
        } finally {
            setLoadingPage(false)
        }
    }

    useEffect(() => {
        const newList = brands.filter(brand => brand.name?.toLowerCase().includes(searchBrands.toLowerCase()))
        setFilteredBrands(newList)
    }, [searchBrands, brands])

    useEffect(() => {
        if (loadingPage) return;

        const loadData = async () => {
            try {
                setLoadingPage(true);

                const tasks: Promise<any>[] = []
                if (users.length === 0 && !hasFetchedUsers) tasks.push(fetchUsers())
                if (brands.length === 0) tasks.push(fetchBrands())
                if (cars.cars.length === 0) tasks.push(fetchCars())
                if (rankCars.rank.length === 0) tasks.push(fetchRankedCars())
                if (bodyworkStore.bodyworks.length === 0) tasks.push(getBodyworks())

                if (tasks.length > 0) await Promise.all(tasks)
            } catch (err) {
                console.error("Erro ao carregar dados:", err);
            } finally {
                setLoadingPage(false);
            }
        };

        if ((users.length === 0 && !hasFetchedUsers) || ((cars?.cars?.length || 0) === 0 && !hasFetchedCars)) {
            loadData();
        }
    }, [users.length, cars?.cars?.length, loadingPage, hasFetchedUsers, hasFetchedCars]);


    const sortedUsers = [...users].sort((a, b) => {
        const me = a.id === session?.user.id;
        const otherMe = b.id === session?.user.id;

        if (me) return -1;
        if (otherMe) return 1;

        if (a.role === 'ADMIN' && b.role !== 'ADMIN') return -1;
        if (b.role === 'ADMIN' && a.role !== 'ADMIN') return 1;

        return 0;
    });

    const filteredUsers = sortedUsers.filter(
        (user) =>
            user.name.toLowerCase().includes(search.toLowerCase()) ||
            user.email.toLowerCase().includes(search.toLowerCase())
    );

    useEffect(() => {
        if (!cars?.cars) {
            setCarsToShow([]);
            return;
        }

        const q = (searchCars || "").trim().toLowerCase();
        if (!q) {
            setCarsToShow(cars.cars);
            return;
        }

        setCarsToShow(
            cars.cars.filter((car) => {
                const name = car?.name?.toLowerCase() ?? "";
                const brand = car?.brand?.toLowerCase() ?? "";
                return name.includes(q) || brand.includes(q);
            })
        );
    }, [cars.cars, searchCars])

    const handleDeleteUser = async (id: string) => {
        setUserDeleting(id)
        setLoading(true)

        try {
            const response = await DeleteUser(id)

            if (response) {
                toast.success('Usuário deletado com sucesso')
            }
        } catch (error) {
            console.log(error)
            toast.error('Erro ao deletar usuário')
        } finally {
            setLoading(false)
            setUserDeleting('')
        }
    }

    const handleDeleteCar = async (id: string) => {
        setLoading(true)
        try {
            const response = await deleteCar(id)

            if (response) {
                toast.success("Carro deletado com sucesso")
                dialogCloseRef.current?.click()
            }
        } catch (error) {
            toast.error("Erro ao deletar carro")
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    const handleCreateCarOnRank = async () => {
        setLoading(true)
        try {
            const id = selectedCar
            const response = await CreateCarOnRank(id)

            if (response) {
                toast.success('Carro adicionado ao ranking')
                setNewCarRank(false)
            }
        } catch (error) {
            console.log(error)
            toast.error('erro ao adicionar o carro ao ranking')
        } finally {
            setLoading(false)
        }
    }

    const handleCreateBodywork = async () => {
        setLoading(true)
        try {
            const response = await createBodywork({ name: brandData.brand_name, image_url: brandData.img_url })

            if (response) {
                toast.success('Carroceria adicionada')
                bodyworkRef.current?.click()
            }
        } catch (error) {
            console.log(error)
            toast.error('erro ao adicionar a carroceria')
        } finally {
            setLoading(false)
        }
    }

    const handleDeleteBodywork = async (id: string) => {
        setLoading(true)
        try {
            const response = await deleteBodywork(id)

            if (response) {
                toast.success('Carroceria deletada com sucesso')
                bodyworkRef.current?.click()
            }
        } catch (error) {
            console.log(error)
            toast.error('erro ao deletar a carroceria')
        } finally {
            setLoading(false)
        }
    }

    const handleRemoveCarOnRank = async (carId: string) => {
        setRemovingCarId(carId)
        setLoading(true)
        try {
            const response = await DeleteCarOnRank(carId)

            if (response) {
                toast.success('Carro removido do ranking')
                setNewCarRank(false)
            }
        } catch (error) {
            console.log(error)
            toast.error('erro ao remover o carro do ranking')
        } finally {
            setLoading(false)
        }
    }

    const handleDeleteBrand = async (id: string) => {
        setLoading(true)
        try {
            const response = await deleteBrands(id)

            if (response) {
                toast.success('marca deletada com sucesso!')
                toggleDeleteBrandModal.current?.click()
            }
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            {loadingPage ? (
                <div className="flex h-screen bg-gray-50">
                    <aside className="w-64 bg-white p-4 shadow-lg flex flex-col justify-between">
                        <div className="space-y-2">
                            <div className="h-10 w-full rounded-lg bg-gray-200 animate-pulse"></div>
                            <div className="h-10 w-full rounded-lg bg-gray-200 animate-pulse"></div>
                        </div>
                        <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse"></div>
                    </aside>

                    <main className="flex-1 p-8">
                        <div className="flex justify-between mb-10">
                            <div className="h-10 w-96 rounded-lg bg-gray-200 animate-pulse"></div>
                            <div className="h-10 w-32 rounded-lg bg-orange-200 animate-pulse"></div>
                        </div>

                        <div className="flex flex-wrap gap-5">
                            <div className="w-[480px] p-4 bg-white rounded-xl shadow-md border-l-4 border-orange-500 flex items-center space-x-4">
                                <div className="w-14 h-14 rounded-full bg-gray-200 animate-pulse"></div>

                                <div className="flex-1 space-y-2">
                                    <div className="h-5 w-3/4 rounded bg-gray-200 animate-pulse"></div>
                                    <div className="h-4 w-1/2 rounded bg-gray-200 animate-pulse"></div>

                                    <div className="flex justify-between text-xs">
                                        <div className="h-3 w-1/3 rounded bg-gray-200 animate-pulse"></div>
                                        <div className="h-3 w-1/4 rounded bg-gray-200 animate-pulse"></div>
                                    </div>
                                </div>
                            </div>

                            <div className="w-[480px] p-4 bg-white rounded-xl shadow-md border-l-4 border-orange-500 flex items-center space-x-4">
                                <div className="w-14 h-14 rounded-full bg-gray-200 animate-pulse"></div>

                                <div className="flex-1 space-y-2">
                                    <div className="h-5 w-3/4 rounded bg-gray-200 animate-pulse"></div>
                                    <div className="h-4 w-1/2 rounded bg-gray-200 animate-pulse"></div>

                                    <div className="flex justify-between text-xs">
                                        <div className="h-3 w-1/3 rounded bg-gray-200 animate-pulse"></div>
                                        <div className="h-3 w-1/4 rounded bg-gray-200 animate-pulse"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </main>
                </div>
            ) : (
                <main className="w-full h-screen bg-zinc-200 flex">
                    <section className="min-w-[250px] max-md:hidden bg-zinc-300 backdrop-blur-md flex-1 flex flex-col gap-3 p-4">
                        <Link href={'/'} className="font-black text-2xl text-center">
                            <h1 className="text-amber-600 flex justify-center gap-2 items-center"><Car /> Carrologia</h1>
                            <h1>Administrador</h1>
                        </Link>
                        <Button onClick={() => handleTabChange('users')} variant={activeTab === 'users' ? 'default' : 'ghost'} className="w-full cursor-pointer border-zinc-400/40 border">
                            <User2 />
                            Usuários
                        </Button>
                        <Button onClick={() => handleTabChange('cars')} variant={activeTab === 'cars' ? 'default' : 'ghost'} className="w-full cursor-pointer border-zinc-400/40 border">
                            <CarFront />
                            Carros
                        </Button>
                        <Button onClick={() => handleTabChange('brand')} variant={activeTab === 'brand' ? 'default' : 'ghost'} className="w-full cursor-pointer border-zinc-400/40 border">
                            <KeySquare />
                            Marcas
                        </Button>
                        <Button onClick={() => handleTabChange('rank')} variant={activeTab === 'rank' ? 'default' : 'ghost'} className="w-full cursor-pointer border-zinc-400/40 border">
                            <Trophy />
                            Ranking
                        </Button>
                        <Button onClick={() => handleTabChange('bodywork')} variant={activeTab === 'bodywork' ? 'default' : 'ghost'} className="w-full cursor-pointer border-zinc-400/40 border">
                            <ToolCase />
                            Carrocerias
                        </Button>
                    </section>

                    <div className="fixed top-3 left-5 z-30 md:hidden">
                        <Popover>
                            <PopoverTrigger asChild>
                                <div className="text-amber-600 bg-zinc-300 p-2 rounded-full cursor-pointer">
                                    {activeTab === 'users' ?
                                        <User className="size-7" /> : activeTab === 'cars' ?
                                            <Car className="size-8" /> : activeTab === 'brand' ?
                                                <KeySquare className="size-7" /> : activeTab === 'rank' ?
                                                    <Trophy className="size-7" /> : activeTab === 'bodywork' &&
                                                    <ToolCase className="size-7" />
                                    }
                                </div>
                            </PopoverTrigger>
                            <PopoverContent className="max-w-80 w-60 ml-4 mt-2 bg-zinc-300/80 backdrop-blur-sm">
                                <div className="border border-zinc-400/80 rounded-2xl mb-3 shadow p-2">
                                    <Link href={'/'} className="font-black text-2xl text-center">
                                        <h1 className="text-amber-600 flex justify-center gap-2 items-center"><Car /> Carrologia</h1>
                                        <h1>Administrador</h1>
                                    </Link>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <Button onClick={() => handleTabChange('users')} variant={activeTab === 'users' ? 'default' : 'ghost'} className="w-full cursor-pointer border-zinc-400/40 border">
                                        <User2 />
                                        Usuários
                                    </Button>
                                    <Button onClick={() => handleTabChange('cars')} variant={activeTab === 'cars' ? 'default' : 'ghost'} className="w-full cursor-pointer border-zinc-400/40 border">
                                        <CarFront />
                                        Carros
                                    </Button>
                                    <Button onClick={() => handleTabChange('brand')} variant={activeTab === 'brand' ? 'default' : 'ghost'} className="w-full cursor-pointer border-zinc-400/40 border">
                                        <KeySquare />
                                        Marcas
                                    </Button>
                                    <Button onClick={() => handleTabChange('rank')} variant={activeTab === 'rank' ? 'default' : 'ghost'} className="w-full cursor-pointer border-zinc-400/40 border">
                                        <Trophy />
                                        Ranking
                                    </Button>
                                    <Button onClick={() => handleTabChange('bodywork')} variant={activeTab === 'bodywork' ? 'default' : 'ghost'} className="w-full cursor-pointer border-zinc-400/40 border">
                                        <ToolCase />
                                        Carrocerias
                                    </Button>
                                </div>
                            </PopoverContent>
                        </Popover>
                    </div>

                    {activeTab === 'users' ? (
                        <section className="w-full h-full px-3">
                            <div className="h-18 flex items-center justify-between gap-2 sticky top-0 z-20 bg-zinc-200/80 backdrop-blur-sm">
                                <div className="w-[100px]" />
                                <Input
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Pesquisar usuários"
                                    className="w-full max-w-160 text-zinc-700 bg-zinc-50 shadow-md hover:shadow-lg"
                                />

                                <Dialog open={newUserModal} onOpenChange={setNewUserModal}>
                                    <DialogTrigger asChild>
                                        <Button className="cursor-pointer">
                                            <Plus className="md:mr-2 h-4 w-4" />
                                            <h1 className="max-md:hidden">Criar Novo Usuário</h1>
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="sm:max-w-[425px]">
                                        <DialogHeader>
                                            <DialogTitle>Criar novo usuário</DialogTitle>
                                            <DialogDescription>
                                                Preencha os dados abaixo para criar uma nova conta de usuário.
                                            </DialogDescription>
                                        </DialogHeader>

                                        <form action={handleRegister} className="space-y-4">
                                            <div className="grid gap-4 py-4">
                                                <Input
                                                    value={userData.name}
                                                    onChange={(e) => setUserData({ ...userData, name: e.target.value })}
                                                    placeholder="Nome do usuário"
                                                    type="text"
                                                    required
                                                    className="border-zinc-300 focus-visible:ring-2 focus-visible:ring-orange-500"
                                                />

                                                <Input
                                                    value={userData.email}
                                                    onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                                                    placeholder="Email"
                                                    type="email"
                                                    required
                                                    className="border-zinc-300 focus-visible:ring-2 focus-visible:ring-orange-500"
                                                />

                                                <div>
                                                    <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 mb-2 block">
                                                        Função
                                                    </label>
                                                    <div className="flex space-x-3">
                                                        <Button
                                                            type="button"
                                                            variant={userData.role === 'USER' ? 'default' : 'outline'}
                                                            onClick={() => setUserData({ ...userData, role: 'USER' })}
                                                            className={`${userData.role === 'USER' ? "bg-orange-600 hover:bg-orange-700 text-white" : "border-zinc-300"} flex-1 cursor-pointer`}
                                                        >
                                                            Usuário
                                                        </Button>

                                                        <Button
                                                            type="button"
                                                            variant={userData.role === 'ADMIN' ? 'default' : 'outline'}
                                                            onClick={() => setUserData({ ...userData, role: 'ADMIN' })}
                                                            className={`${userData.role === 'ADMIN' ? "bg-orange-600 hover:bg-orange-700 text-white" : "border-zinc-300"} flex-1 cursor-pointer`}
                                                        >
                                                            Admin
                                                        </Button>
                                                    </div>
                                                </div>

                                                <Input
                                                    value={userData.password}
                                                    onChange={(e) => setUserData({ ...userData, password: e.target.value })}
                                                    placeholder="Senha"
                                                    type="password"
                                                    required
                                                    className="border-zinc-300 focus-visible:ring-2 focus-visible:ring-orange-500"
                                                />
                                            </div>

                                            <DialogFooter>
                                                <Button
                                                    disabled={loading}
                                                    type="submit"
                                                    className="w-full cursor-pointer bg-orange-600 hover:bg-orange-700 text-white"
                                                >
                                                    Criar
                                                </Button>
                                            </DialogFooter>
                                        </form>
                                    </DialogContent>
                                </Dialog>

                                <Dialog open={userEdit} onOpenChange={setUserEdit}>
                                    <DialogContent className="sm:max-w-[425px]">
                                        <DialogHeader>
                                            <DialogTitle>Editar {userData.name}</DialogTitle>
                                            <DialogDescription>
                                                Atualize as informações de usuário ou defina uma nova senha.
                                            </DialogDescription>
                                        </DialogHeader>

                                        <form action={handleEditUser} className="space-y-4">
                                            <div className="grid gap-4 py-4">
                                                <Input
                                                    value={userData.name}
                                                    onChange={(e) => setUserData({ ...userData, name: e.target.value })}
                                                    placeholder="Nome do usuário"
                                                    type="text"
                                                    required
                                                    className="border-zinc-300 focus-visible:ring-2 focus-visible:ring-orange-500"
                                                />

                                                <Input
                                                    value={userData.email}
                                                    onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                                                    placeholder="Email"
                                                    type="email"
                                                    required
                                                    className="border-zinc-300 focus-visible:ring-2 focus-visible:ring-orange-500"
                                                />

                                                <div>
                                                    <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 mb-2 block">
                                                        Função
                                                    </label>
                                                    <div className="flex space-x-3">
                                                        <Button
                                                            type="button"
                                                            variant={userData.role === 'USER' ? 'default' : 'outline'}
                                                            onClick={() => setUserData({ ...userData, role: 'USER' })}
                                                            className={`${userData.role === 'USER' ? "bg-orange-600 hover:bg-orange-700 text-white" : "border-zinc-300"} flex-1 cursor-pointer`}
                                                        >
                                                            Usuário
                                                        </Button>

                                                        <Button
                                                            type="button"
                                                            variant={userData.role === 'ADMIN' ? 'default' : 'outline'}
                                                            onClick={() => setUserData({ ...userData, role: 'ADMIN' })}
                                                            className={`${userData.role === 'ADMIN' ? "bg-orange-600 hover:bg-orange-700 text-white" : "border-zinc-300"} flex-1 cursor-pointer`}
                                                        >
                                                            Admin
                                                        </Button>
                                                    </div>
                                                </div>

                                                <Input
                                                    value={userData.password}
                                                    onChange={(e) => setUserData({ ...userData, password: e.target.value })}
                                                    placeholder="Nova senha (deixe em branco para não alterar)"
                                                    type="password"
                                                    className="border-zinc-300 focus-visible:ring-2 focus-visible:ring-orange-500"
                                                />
                                            </div>

                                            <DialogFooter>
                                                <Button
                                                    disabled={loading}
                                                    type="submit"
                                                    className="w-full cursor-pointer bg-orange-600 hover:bg-orange-700 text-white"
                                                >
                                                    Salvar Alterações
                                                </Button>
                                            </DialogFooter>
                                        </form>
                                    </DialogContent>
                                </Dialog>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 p-4">
                                {filteredUsers.map((user) => (
                                    <div
                                        key={user.id}
                                        className={`p-4 bg-white rounded-lg shadow hover:shadow-lg transition-all duration-300 border border-gray-200 relative ${user.role === "ADMIN" ? "bg-gradient-to-tl from-amber-500 to-red-500" : ""} 
                                        ${userDeleting === user.id && 'scale-95 opacity-60'}`}
                                    >
                                        {session && user.id === session.user.id && (
                                            <div className="absolute bg-neutral-600 right-3 top-3 px-4 py-1 rounded-full bg-gradient-to-tl text-sm from-amber-500/60 to-red-500/60 font-bold text-zinc-50 border border-red-300">
                                                Você
                                            </div>
                                        )}

                                        <div className="flex items-center gap-4 mb-4">
                                            <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center text-xl font-bold text-gray-700">
                                                {user.name[0]}
                                            </div>
                                            <div className="-space-y-1">
                                                <h3 className={`font-semibold text-lg text-gray-900 ${user.role === "ADMIN" ? "text-zinc-50" : ""}`}>
                                                    {user.name}
                                                </h3>
                                                <p className={`text-sm text-gray-500 ${user.role === "ADMIN" ? "text-zinc-100" : ""}`}>
                                                    {user.email}
                                                </p>
                                            </div>

                                            {session && session.user.id !== user.id && (
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger className="ml-auto">
                                                        <MoreHorizontal className={`cursor-pointer text-gray-500 hover:text-gray-700 size-5 ${user.role === 'ADMIN' && 'text-zinc-50 hover:text-zinc-100'}`} />
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem onClick={() => {
                                                            setUserData({ name: user.name, email: user.email, password: '', id: user.id, role: user.role })
                                                            setUserEdit(true)
                                                        }} className="cursor-pointer hover:!bg-amber-500/20 hover:!text-zinc-900/80">Editar</DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => {
                                                            setDeleteUserModal(true)
                                                            setUserSelected(user.id)
                                                        }} className="cursor-pointer" variant="destructive">Deletar</DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            )}

                                            {userSelected === user.id && (
                                                <Dialog open={deleteUserModal} onOpenChange={setDeleteUserModal}>
                                                    <DialogContent>
                                                        <DialogTitle>Deletar Usuário?</DialogTitle>
                                                        <DialogDescription>Deseja deletar o {user.name}? essa ação não pode ser desfeita</DialogDescription>

                                                        <div className="flex items-center gap-1 mt-8">
                                                            <Button
                                                                onClick={() => handleDeleteUser(user.id)}
                                                                disabled={loading}
                                                                variant={'destructive'}
                                                                size={'sm'}
                                                                className="cursor-pointer flex-1 hover:scale-y-105"
                                                            >
                                                                <Trash />
                                                                Deletar
                                                            </Button>

                                                            <DialogClose asChild>
                                                                <Button variant={'secondary'} size={'sm'} className="cursor-pointer flex-1 hover:scale-y-105 bg-zinc-200 hover:bg-zinc-300/70">
                                                                    Cancelar
                                                                </Button>
                                                            </DialogClose>
                                                        </div>

                                                        <DialogClose ref={dialogCloseRef} className="hidden" />
                                                    </DialogContent>
                                                </Dialog>
                                            )}
                                        </div>

                                        <div className="flex justify-between text-sm text-gray-600">
                                            <span className={`${user.role === "ADMIN" ? "text-zinc-100" : ""} font-semibold text-xs`}>
                                                Função: {user.role === "USER" ? "USUÁRIO" : user.role}
                                            </span>
                                            <span className={`${user.role === "ADMIN" ? "text-zinc-100" : ""} font-semibold text-xs`}>
                                                Criado em: {new Date(user.created_at).toLocaleString('pt-BR', {
                                                    day: '2-digit',
                                                    month: '2-digit',
                                                    hour: '2-digit',
                                                    minute: '2-digit',
                                                })}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    ) : activeTab === 'cars' ? (
                        <section className="w-full h-[calc(100dvh-5px)] overflow-y-auto">
                            <div className="h-18 px-3 flex items-center justify-between gap-2 sticky top-0 z-20 bg-zinc-200/80 backdrop-blur-sm">
                                <div className="w-[100px]" />
                                <Input
                                    value={searchCars}
                                    onChange={(e) => setSearchCars(e.target.value)}
                                    placeholder="Pesquisar por carros"
                                    className="w-full max-w-160 text-zinc-700 bg-zinc-50 shadow-md hover:shadow-lg"
                                />

                                <Dialog open={newCarModal} onOpenChange={(open) => handleCarModalOpenChange(open)}>
                                    <Button className="cursor-pointer flex items-center gap-2" onClick={() => { setEditingCarId(null); setNewCarModal(true); }}>
                                        <Plus className="h-4 w-4" />
                                        <h1 className="max-md:hidden">Criar Novo Carro</h1>
                                    </Button>

                                    <DialogContent className="!max-w-6xl w-full rounded-xl p-8 overflow-y-auto max-h-[95vh]">
                                        <DialogTitle className="text-2xl font-bold mb-4 border-b pb-2">Criar / Editar Veículo</DialogTitle>

                                        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
                                            <Tabs value={tabCreateCar} onValueChange={setTabCreateCar} defaultValue="details" className="w-full">
                                                <TabsList className="grid grid-cols-3 w-full bg-stone-200">
                                                    <TabsTrigger
                                                        value="details"
                                                        className={`cursor-pointer hover:bg-orange-300/20 rounded-sm transition-all duration-200 ${tabCreateCar === 'details' && '!bg-orange-300/20'}`}
                                                    >
                                                        Detalhes
                                                    </TabsTrigger>
                                                    <TabsTrigger
                                                        value="specs"
                                                        className={`cursor-pointer hover:bg-orange-300/20 rounded-sm transition-all duration-200 ${tabCreateCar === 'specs' && '!bg-orange-300/20'}`}
                                                    >
                                                        Especificações
                                                    </TabsTrigger>
                                                    <TabsTrigger
                                                        value="features"
                                                        className={`cursor-pointer hover:bg-orange-300/20 rounded-sm transition-all duration-200 ${tabCreateCar === 'features' && '!bg-orange-300/20'}`}
                                                    >
                                                        Recursos
                                                    </TabsTrigger>
                                                </TabsList>

                                                <TabsContent value="details" className="pt-6 flex flex-col gap-5">
                                                    <Controller
                                                        control={control}
                                                        name="popular"
                                                        render={({ field }) => (
                                                            <div className="flex items-center gap-2">
                                                                <Checkbox
                                                                    className="bg-zinc-300"
                                                                    checked={!!field.value}
                                                                    onCheckedChange={(v) => field.onChange(!!v)}
                                                                    onBlur={field.onBlur}
                                                                    name={field.name}
                                                                    ref={field.ref}
                                                                    disabled={field.disabled}
                                                                />
                                                                <h1 className="font-semibold capitalize">carro popular</h1>
                                                            </div>
                                                        )} />
                                                    <Controller
                                                        control={control}
                                                        name="name"
                                                        render={({ field }) => (
                                                            <div>
                                                                <label className="text-sm ml-2 text-muted-foreground">Nome *</label>
                                                                <Input
                                                                    {...field}
                                                                    placeholder="Nome Completo do Veículo (Ex: Fiat Argo 1.0 Flex)"
                                                                    className="bg-stone-200/80"
                                                                />
                                                                {errors.name && <p className="text-destructive text-sm mt-1">{String(errors.name?.message)}</p>}
                                                            </div>
                                                        )}
                                                    />

                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        <Controller control={control} name="brandId" render={({ field }) => (
                                                            <div>
                                                                <label className="text-sm ml-2 text-muted-foreground">Marca *</label>
                                                                <Select value={String(field.value ?? '')}
                                                                    onValueChange={(v) => {
                                                                        field.onChange(v)

                                                                        const selectedBrand = brands.find((b) => b.id === v)

                                                                        setValue("brand", selectedBrand?.name || '')
                                                                    }}>
                                                                    <SelectTrigger className="w-full bg-stone-200">Marca</SelectTrigger>
                                                                    <SelectContent className="bg-stone-200">
                                                                        {brands.map(brand => (
                                                                            <SelectItem key={brand.id} value={brand.id}>{brand.name}</SelectItem>
                                                                        ))}
                                                                    </SelectContent>
                                                                </Select>
                                                                {errors.brandId && <p className="text-destructive text-sm mt-1">{errors.brandId.message}</p>}
                                                            </div>
                                                        )} />

                                                        <Controller
                                                            control={control}
                                                            name="brand"
                                                            render={({ field }) => (
                                                                <div>
                                                                    <label className="text-sm ml-2 text-muted-foreground">Nome da Marca *</label>
                                                                    <Input readOnly {...field} placeholder="Marca *" className="bg-stone-200/80" />
                                                                    {errors.brand && <p className="text-destructive text-sm mt-1">{String(errors.brand?.message)}</p>}
                                                                </div>
                                                            )}
                                                        />

                                                        <Controller
                                                            control={control}
                                                            name="model"
                                                            render={({ field }) => (
                                                                <div>
                                                                    <label className="text-sm ml-2 text-muted-foreground">Modelo *</label>
                                                                    <Input {...field} placeholder="Modelo" className="bg-stone-200/80" />
                                                                    {errors.model && <p className="text-destructive text-sm mt-1">{errors.model.message}</p>}
                                                                </div>
                                                            )}
                                                        />

                                                        <Controller
                                                            control={control}
                                                            name="bodyworkId"
                                                            render={({ field }) => {
                                                                const selectedBodywork = bodyworkStore.bodyworks.find(
                                                                    (b) => b.id === field.value
                                                                )

                                                                return (
                                                                    <div>
                                                                        <label className="text-sm ml-2 text-muted-foreground">
                                                                            Carroceria *
                                                                        </label>
                                                                        <Select
                                                                            value={selectedBodywork?.id ?? ""}
                                                                            onValueChange={(v) => field.onChange(v)}
                                                                        >
                                                                            <SelectTrigger className="w-full bg-stone-200">
                                                                                {selectedBodywork ? selectedBodywork.name : "Carroceria"}
                                                                            </SelectTrigger>
                                                                            <SelectContent className="bg-stone-200">
                                                                                {bodyworkStore.bodyworks.map((bodywork) => (
                                                                                    <SelectItem key={bodywork.id} value={bodywork.id}>
                                                                                        {bodywork.name}
                                                                                    </SelectItem>
                                                                                ))}
                                                                            </SelectContent>
                                                                        </Select>

                                                                        {errors.bodyworkId && (
                                                                            <p className="text-destructive text-sm mt-1">
                                                                                {errors.bodyworkId.message}
                                                                            </p>
                                                                        )}
                                                                    </div>
                                                                )
                                                            }}
                                                        />
                                                    </div>

                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        <Controller
                                                            control={control}
                                                            name="fipe"
                                                            render={({ field }) => (
                                                                <div>
                                                                    <label className="text-sm ml-2 text-muted-foreground">Fipe *</label>
                                                                    <Input {...field} placeholder="Valor FIPE (R$)" type="number" step="10" className="bg-stone-200/80" />
                                                                    {errors.fipe && <p className="text-destructive text-sm mt-1">{errors.fipe.message}</p>}
                                                                </div>
                                                            )}
                                                        />
                                                        <Controller
                                                            control={control}
                                                            name="year"
                                                            render={({ field }) => (
                                                                <div>
                                                                    <label className="text-sm ml-2 text-muted-foreground">Ano de fabricação *</label>
                                                                    <Input {...field} placeholder="Ano de Fabricação" type="number" className="bg-stone-200/80" />
                                                                    {errors.year && <p className="text-destructive text-sm mt-1">{errors.year.message}</p>}
                                                                </div>
                                                            )}
                                                        />
                                                    </div>

                                                    <Controller control={control} name="imageUrl" render={({ field }) => (
                                                        <div>
                                                            <label className="text-sm ml-2 text-muted-foreground">Link da imagem *</label>
                                                            <Input {...field} placeholder="URL da Imagem Principal" className="bg-stone-200/80" />
                                                            {errors.imageUrl && <p className="text-destructive text-sm mt-1">{errors.imageUrl.message}</p>}
                                                        </div>
                                                    )} />

                                                    <Controller control={control} name="videoUrl" render={({ field }) => (
                                                        <div>
                                                            <label className="text-sm ml-2 text-muted-foreground">Link do vídeo *</label>
                                                            <Input {...field} placeholder="URL do vídeo Principal" className="bg-stone-200/80" />
                                                            {errors.videoUrl && <p className="text-destructive text-sm mt-1">{errors.videoUrl.message}</p>}
                                                        </div>
                                                    )} />

                                                    <Controller control={control} name="description" render={({ field }) => (
                                                        <div>
                                                            <label className="text-sm ml-2 text-muted-foreground">Descrição *</label>
                                                            <Textarea {...field} placeholder="Descrição detalhada do veículo. Destaque diferenciais e histórico." className="bg-stone-200/80" />
                                                            {errors.description && <p className="text-destructive text-sm mt-1">{errors.description.message}</p>}
                                                        </div>
                                                    )} />
                                                </TabsContent>

                                                <TabsContent value="specs" className="pt-6 flex flex-col gap-6">

                                                    <section>
                                                        <h3 className="text-lg font-semibold mb-3 border-b pb-1">Motorização e Performance</h3>
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                            <Controller control={control} name="specifications.fuel" render={({ field }) => (
                                                                <div>
                                                                    <label className="text-sm ml-2 text-muted-foreground">Combustível *</label>
                                                                    <Select value={field.value} onValueChange={(v) => field.onChange(v)}>
                                                                        <SelectTrigger className="w-full bg-stone-200">Combustível</SelectTrigger>
                                                                        <SelectContent className="bg-stone-200">
                                                                            <SelectItem value="GASOLINE">Gasolina</SelectItem>
                                                                            <SelectItem value="ETHANOL">Etanol</SelectItem>
                                                                            <SelectItem value="DIESEL">Diesel</SelectItem>
                                                                            <SelectItem value="ELECTRIC">Elétrico</SelectItem>
                                                                            <SelectItem value="HYBRID">Híbrido</SelectItem>
                                                                        </SelectContent>
                                                                    </Select>
                                                                    {errors.specifications?.fuel && <p className="text-destructive text-sm mt-1">{errors.specifications?.fuel.message}</p>}
                                                                </div>
                                                            )} />
                                                            <Controller control={control} name="specifications.engine" render={({ field }) => (
                                                                <div>
                                                                    <label className="text-sm ml-2 text-muted-foreground">Motor *</label>
                                                                    <Input {...field} placeholder="Motor (Ex: 2.0 Turbo)" className="bg-stone-200" />
                                                                    {errors.specifications?.engine && <p className="text-destructive text-sm mt-1">{errors.specifications?.engine.message}</p>}
                                                                </div>
                                                            )} />
                                                            <Controller control={control} name="specifications.power" render={({ field }) => (
                                                                <div>
                                                                    <label className="text-sm ml-2 text-muted-foreground">Potência *</label>
                                                                    <Input {...field} placeholder="Potência (Ex: 150 cv)" className="bg-stone-200" />
                                                                    {errors.specifications?.power && <p className="text-destructive text-sm mt-1">{errors.specifications?.power.message}</p>}
                                                                </div>
                                                            )} />
                                                            <Controller control={control} name="specifications.torque" render={({ field }) => (
                                                                <div>
                                                                    <label className="text-sm ml-2 text-muted-foreground">Torque *</label>
                                                                    <Input {...field} placeholder="Torque (Ex: 20 kgfm)" className="bg-stone-200" />
                                                                    {errors.specifications?.torque && <p className="text-destructive text-sm mt-1">{errors.specifications?.torque.message}</p>}
                                                                </div>
                                                            )} />
                                                            <Controller control={control} name="specifications.consumption" render={({ field }) => (
                                                                <div>
                                                                    <label className="text-sm ml-2 text-muted-foreground">Consumo *</label>
                                                                    <Input {...field} placeholder="Consumo (Ex: 12 km/l cidade)" className="bg-stone-200" />
                                                                    {errors.specifications?.consumption && <p className="text-destructive text-sm mt-1">{errors.specifications?.consumption.message}</p>}
                                                                </div>
                                                            )} />
                                                            <Controller control={control} name="specifications.maxSpeed" render={({ field }) => (
                                                                <div>
                                                                    <label className="text-sm ml-2 text-muted-foreground">Velocidade máxima *</label>
                                                                    <Input {...field} placeholder="Velocidade máxima (km/h)" className="bg-stone-200" />
                                                                    {errors.specifications?.maxSpeed && <p className="text-destructive text-sm mt-1">{errors.specifications?.maxSpeed.message}</p>}
                                                                </div>
                                                            )} />
                                                            <Controller control={control} name="specifications.acceleration" render={({ field }) => (
                                                                <div>
                                                                    <label className="text-sm ml-2 text-muted-foreground">Aceleração *</label>
                                                                    <Input {...field} placeholder="0-100 km/h (segundos)" className="bg-stone-200" />
                                                                    {errors.specifications?.acceleration && <p className="text-destructive text-sm mt-1">{errors.specifications?.acceleration.message}</p>}
                                                                </div>
                                                            )} />
                                                        </div>
                                                    </section>

                                                    <section>
                                                        <h3 className="text-lg font-semibold mb-3 border-b pb-1">Estrutura e Capacidade</h3>
                                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                            <Controller control={control} name="specifications.transmission" render={({ field }) => (
                                                                <div>
                                                                    <label className="text-sm ml-2 text-muted-foreground">Câmbio *</label>
                                                                    <Select value={field.value} onValueChange={(v) => field.onChange(v)}>
                                                                        <SelectTrigger className="w-full bg-stone-200">Câmbio</SelectTrigger>
                                                                        <SelectContent className="bg-stone-200">
                                                                            <SelectItem value="MANUAL">Manual</SelectItem>
                                                                            <SelectItem value="AUTOMATIC">Automático</SelectItem>
                                                                            <SelectItem value="CVT">CVT</SelectItem>
                                                                            <SelectItem value="SEMI_AUTOMATIC">Semi-Automático</SelectItem>
                                                                        </SelectContent>
                                                                    </Select>
                                                                    {errors.specifications?.transmission && <p className="text-destructive text-sm mt-1">{errors.specifications?.transmission.message}</p>}
                                                                </div>
                                                            )} />

                                                            <Controller control={control} name="specifications.seats" render={({ field }) => (
                                                                <div>
                                                                    <label className="text-sm ml-2 text-muted-foreground">Assentos *</label>
                                                                    <Input {...field} placeholder="Assentos" type="number" className="bg-stone-200" />
                                                                    {errors.specifications?.seats && <p className="text-destructive text-sm mt-1">{errors.specifications?.seats.message}</p>}
                                                                </div>
                                                            )} />
                                                            <Controller control={control} name="specifications.doors" render={({ field }) => (
                                                                <div>
                                                                    <label className="text-sm ml-2 text-muted-foreground">Portas *</label>
                                                                    <Input {...field} placeholder="Portas" type="number" className="bg-stone-200" />
                                                                    {errors.specifications?.doors && <p className="text-destructive text-sm mt-1">{errors.specifications?.doors.message}</p>}
                                                                </div>
                                                            )} />
                                                        </div>

                                                        <div className="flex gap-4 items-center">
                                                            <Controller control={control} name="specifications.trunkCapacity" render={({ field }) => (
                                                                <div className="w-full mt-2">
                                                                    <label className="text-sm ml-2 text-muted-foreground truncate">porta-malas *</label>
                                                                    <Input {...field} className="bg-stone-200" placeholder="Capacidade do porta-malas (Litros)" />
                                                                    {errors.specifications?.trunkCapacity && <p className="text-destructive text-sm mt-1">{errors.specifications?.trunkCapacity.message}</p>}
                                                                </div>
                                                            )} />
                                                            <Controller control={control} name="specifications.weight" render={({ field }) => (
                                                                <div className="w-full mt-2">
                                                                    <label className="text-sm ml-2 text-muted-foreground">Peso *</label>
                                                                    <Input {...field} className="bg-stone-200" placeholder="Peso (KG)" />
                                                                    {errors.specifications?.weight && <p className="text-destructive text-sm mt-1">{errors.specifications?.weight.message}</p>}
                                                                </div>
                                                            )} />
                                                            <Controller control={control} name="specifications.traction" render={({ field }) => (
                                                                <div className="w-full mt-2">
                                                                    <label className="text-sm ml-2 text-muted-foreground">Tração *</label>
                                                                    <Select value={field.value} onValueChange={(v) => field.onChange(v)}>
                                                                        <SelectTrigger className="w-full bg-stone-200">Tração</SelectTrigger>
                                                                        <SelectContent className="bg-stone-200">
                                                                            <SelectItem value="FRONT">Dianteira</SelectItem>
                                                                            <SelectItem value="BACK">Traseira</SelectItem>
                                                                            <SelectItem value="4X4">4X4</SelectItem>
                                                                        </SelectContent>
                                                                    </Select>
                                                                    {errors.specifications?.traction && <p className="text-destructive text-sm mt-1">{errors.specifications?.traction.message}</p>}
                                                                </div>
                                                            )} />
                                                        </div>
                                                    </section>
                                                </TabsContent>

                                                <TabsContent value="features" className="pt-6 flex flex-col gap-4">
                                                    <h3 className="text-lg font-semibold border-b pb-1">Recursos Opcionais e de Série</h3>

                                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4">
                                                        {Object.keys(initialCarData.features).map((feature) => (
                                                            <div key={feature} className="flex items-center space-x-2">
                                                                <Controller control={control} name={("features." + feature) as any} render={({ field }) => (
                                                                    <Checkbox className="bg-stone-200 cursor-pointer" id={feature} checked={!!field.value} onCheckedChange={(v) => field.onChange(!!v)} />
                                                                )} />
                                                                <Label htmlFor={feature} className="text-sm font-medium leading-none cursor-pointer">
                                                                    {featureLabels[feature] || feature}
                                                                </Label>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </TabsContent>
                                            </Tabs>
                                            <div className="flex items-center gap-1">
                                                <Button type="submit" className="w-fit py-2 text-sm cursor-pointer font-semibold" disabled={loading || isSubmitting}>
                                                    {loading || isSubmitting ? "Salvando..." : "Salvar Veículo"}
                                                </Button>
                                                <Button type="button" variant="ghost" onClick={() => handleCarModalOpenChange(false)}>
                                                    Cancelar
                                                </Button>
                                            </div>
                                        </form>
                                    </DialogContent>
                                </Dialog>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 p-4">
                                {carsToShow.length > 0 ? carsToShow.map((car) => (
                                    <Card
                                        key={car.id}
                                        className="group hover:shadow-lg mt-6 transition-all duration-300 border-border hover:border-accent/50 p-0"
                                    >
                                        <CardContent className="!p-0">
                                            <div className="relative overflow-hidden rounded-t-lg">
                                                <img
                                                    src={car.imageUrl || "/placeholder.svg"}
                                                    alt={`${car.brand} ${car.name}`}
                                                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                                                />

                                                <div className="absolute top-3 right-3 flex items-center gap-1">
                                                    <Badge className="bg-accent text-accent-foreground">{car.year}</Badge>

                                                    {car.popular && (
                                                        <Badge className="bg-sky-500 text-accent-foreground">Popular</Badge>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="p-6">
                                                <div className="flex items-center justify-between mb-3">
                                                    <h3 className="text-xl font-bold text-foreground truncate">
                                                        {car.brand} {car.name}
                                                    </h3>
                                                    <span className="text-lg font-semibold text-accent text-nowrap">R$ {car.fipe?.toFixed(3)}</span>
                                                </div>

                                                <div className="space-y-2 mb-4 text-sm text-muted-foreground">
                                                    <div className="flex justify-between gap-3">
                                                        <span>Motor:</span>
                                                        <span className="font-medium text-foreground truncate">{car.specifications?.engine}</span>
                                                    </div>
                                                    <div className="flex justify-between gap-3">
                                                        <span>Potência:</span>
                                                        <span className="font-medium text-foreground truncate">{car.specifications?.power}</span>
                                                    </div>
                                                    <div className="flex justify-between gap-3">
                                                        <span>Consumo:</span>
                                                        <span className="font-medium text-foreground truncate">{car.specifications?.consumption}</span>
                                                    </div>
                                                </div>

                                                <section className="flex items-center gap-3 w-full">
                                                    <Button
                                                        disabled={loading}
                                                        onClick={() => handleOpenEdit(car)}
                                                        className="w-full bg-accent cursor-pointer flex-1 hover:bg-accent/90 text-accent-foreground"
                                                    >
                                                        Editar
                                                    </Button>

                                                    <Dialog>
                                                        <DialogTrigger asChild>
                                                            <Button
                                                                className="w-full cursor-pointer flex-1 hover:bg-red-500/50
                                                                        bg-red-500/60 border border-red-500/70 text-red-700"
                                                            >
                                                                Deletar
                                                            </Button>
                                                        </DialogTrigger>
                                                        <DialogContent>
                                                            <DialogTitle>Deletar Carro?</DialogTitle>
                                                            <DialogDescription>Deseja deletar o {car.name}? essa ação não pode ser desfeita</DialogDescription>

                                                            <div className="flex items-center gap-1 mt-8">
                                                                <Button
                                                                    onClick={() => handleDeleteCar(car.id)}
                                                                    disabled={loading}
                                                                    variant={'destructive'}
                                                                    size={'sm'}
                                                                    className="cursor-pointer flex-1 hover:scale-y-105"
                                                                >
                                                                    <Trash />
                                                                    Deletar
                                                                </Button>

                                                                <DialogClose asChild>
                                                                    <Button variant={'secondary'} size={'sm'} className="cursor-pointer flex-1 hover:scale-y-105 bg-zinc-200 hover:bg-zinc-300/70">
                                                                        Cancelar
                                                                    </Button>
                                                                </DialogClose>
                                                            </div>

                                                            <DialogClose ref={dialogCloseRef} className="hidden" />
                                                        </DialogContent>
                                                    </Dialog>
                                                </section>
                                            </div>
                                        </CardContent>
                                    </Card>
                                )) : (
                                    <Card
                                        className="group hover:shadow-xl mt-6 transition-all duration-300 border-border hover:border-accent-foreground/50 p-4 cursor-pointer"
                                    >
                                        <CardContent className="flex items-center justify-between p-0" onClick={() => setNewCarModal(true)}>
                                            <div className="flex items-center space-x-3">
                                                <Car className="h-6 w-6 text-accent-foreground group-hover:text-primary transition-colors duration-300" />
                                                <CardTitle className="text-lg font-semibold tracking-tight">
                                                    Criar seu primeiro carro
                                                </CardTitle>
                                            </div>

                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground group-hover:text-primary/70">
                                                <ArrowRight className="h-5 w-5" />
                                            </Button>
                                        </CardContent>
                                    </Card>
                                )}
                            </div>
                        </section>
                    ) : activeTab === 'brand' ? (
                        <section className="w-full h-full max-h-[calc(100dvh)] overflow-y-auto px-5">
                            <div className="h-18 flex items-center justify-between gap-2 sticky top-0 z-20 bg-zinc-200/80 backdrop-blur-sm">
                                <div className="w-[100px]" />
                                <Input
                                    value={searchBrands}
                                    onChange={(e) => setSearchBrands(e.target.value)}
                                    placeholder="Pesquisar marcas"
                                    className="w-full max-w-160 text-zinc-700 bg-zinc-50 shadow-md hover:shadow-lg"
                                />

                                <Dialog open={newUserModal} onOpenChange={setNewUserModal}>
                                    <DialogTrigger asChild>
                                        <Button className="cursor-pointer">
                                            <Plus className="md:mr-2 h-4 w-4" />
                                            <h1 className="max-md:hidden">Registrar marca</h1>
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="sm:max-w-[425px]">
                                        <DialogHeader>
                                            <DialogTitle>Registrar marca</DialogTitle>
                                            <DialogDescription>
                                                Preencha os dados abaixo para registrar uma nova marca
                                            </DialogDescription>
                                        </DialogHeader>

                                        <form action={handleCreateBrand} className="space-y-4">
                                            <div className="grid gap-4 py-4">
                                                <Input
                                                    value={brandData.brand_name}
                                                    onChange={(e) => setBrandData({ ...brandData, brand_name: e.target.value })}
                                                    placeholder="Nome da marca"
                                                    type="text"
                                                    required
                                                    className="border-zinc-300 focus-visible:ring-2 focus-visible:ring-orange-500"
                                                />

                                                <Input
                                                    value={brandData.img_url}
                                                    onChange={(e) => setBrandData({ ...brandData, img_url: e.target.value })}
                                                    placeholder="url da logo da marca"
                                                    type="text"
                                                    required
                                                    className="border-zinc-300 focus-visible:ring-2 focus-visible:ring-orange-500"
                                                />
                                            </div>

                                            <DialogFooter>
                                                <Button
                                                    disabled={loading}
                                                    type="submit"
                                                    className="w-full cursor-pointer bg-orange-600 hover:bg-orange-700 text-white"
                                                >
                                                    Registrar
                                                </Button>
                                            </DialogFooter>
                                        </form>
                                    </DialogContent>
                                </Dialog>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                                {filteredBrands.map((brand) => (
                                    <div className="flex flex-col items-center relative">
                                        <img src={brand.logo_img || ''} alt="" className="rounded-2xl object-cover h-50 w-full" />
                                        <h1 className="font-bold truncate">{brand.name}</h1>
                                        <Dialog>
                                            <DialogTrigger asChild>
                                                <Button variant={'destructive'} className="bg-red-500/20 border border-red-500/70 rounded-full absolute right-2 top-2 cursor-pointer" size={'icon'}><Trash /></Button>
                                            </DialogTrigger>
                                            <DialogContent>
                                                <DialogHeader>
                                                    <DialogTitle>Deletar marca</DialogTitle>
                                                    <DialogDescription>Deseja realmente deletar essa marca?</DialogDescription>
                                                </DialogHeader>

                                                <section className="w-full flex items-center gap-3">
                                                    <Button disabled={loading} onClick={() => handleDeleteBrand(brand.id)} className="cursor-pointer flex-1 bg-red-500/40 text-red-800 hover:bg-red-500/50 border border-red-500/70">Deletar</Button>
                                                    <DialogClose asChild>
                                                        <Button ref={toggleDeleteBrandModal} variant={'secondary'} className="flex-1 cursor-pointer">Cancelar</Button>
                                                    </DialogClose>
                                                </section>
                                            </DialogContent>
                                        </Dialog>
                                    </div>
                                ))}
                            </div>
                        </section>
                    ) : activeTab === 'rank' ? (
                        <section className="w-full h-full max-h-[calc(100dvh)] overflow-y-auto px-5">
                            <div className="h-18 flex items-center justify-between gap-2 sticky top-0 z-20 bg-zinc-200/80 backdrop-blur-sm">
                                <div className="w-[100px]" />
                                <Input
                                    value={search}

                                    // onChange={(e) => setSearch(e.target.value)}

                                    placeholder="Pesquisar no top10"
                                    className="w-full max-w-160 text-zinc-700 bg-zinc-50 shadow-md hover:shadow-lg"
                                />

                                <Dialog open={newCarRank} onOpenChange={setNewCarRank}>
                                    <DialogTrigger asChild>
                                        <Button className="cursor-pointer">
                                            <Plus className="md:mr-2 h-4 w-4" />
                                            <h1 className="max-md:hidden">Novo carro ao rank</h1>
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="sm:max-w-[425px]">
                                        <DialogHeader>
                                            <DialogTitle>Adicionar carro ao ranking</DialogTitle>
                                            <DialogDescription>
                                                Selecione o carro que você quer adicionar ao ranking
                                            </DialogDescription>
                                        </DialogHeader>

                                        <form action={handleCreateCarOnRank} className="space-y-4">
                                            <div className="grid gap-4 py-4">
                                                <Label>Selecione o carro</Label>
                                                <Select
                                                    value={selectedCar}
                                                    onValueChange={setSelectedCar}
                                                >
                                                    <SelectTrigger className="w-full bg-stone-200">
                                                        <span>{selectedBrandLabel || "Selecione o carro"}</span>
                                                    </SelectTrigger>

                                                    <SelectContent className="bg-stone-200">
                                                        {cars.cars
                                                            .filter(car =>
                                                                !rankCars.rank.some(r => r.carId === car.id)
                                                            )
                                                            .map(car => (
                                                                <SelectItem key={car.id} value={car.id.toString()}>
                                                                    <div className="flex items-center gap-3">
                                                                        <div className="w-12 h-10 rounded-lg overflow-hidden flex-shrink-0">
                                                                            <img
                                                                                src={car.imageUrl || ''}
                                                                                alt={car.name}
                                                                                className="w-full h-full object-cover"
                                                                            />
                                                                        </div>

                                                                        <div className="flex flex-col">
                                                                            <h3 className="text-md font-semibold text-stone-900">
                                                                                {car.name}
                                                                            </h3>
                                                                            <span className="text-stone-700 font-medium mt-1">
                                                                                {formatMoney(car.fipe)}
                                                                            </span>
                                                                        </div>
                                                                    </div>
                                                                </SelectItem>
                                                            ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>

                                            <DialogFooter>
                                                <Button
                                                    disabled={loading}
                                                    type="submit"
                                                    className="w-full cursor-pointer bg-orange-600 hover:bg-orange-700 text-white"
                                                >
                                                    Criar
                                                </Button>
                                            </DialogFooter>
                                        </form>
                                    </DialogContent>
                                </Dialog>

                            </div>
                            <section className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-4">
                                {rankCars.rank.map(rank => (
                                    <Card
                                        key={rank.id}
                                        className="group hover:shadow-lg mt-6 transition-all duration-300 border-border hover:border-accent/50 p-0"
                                    >
                                        <CardContent className="!p-0">
                                            <div className="relative overflow-hidden rounded-t-lg">
                                                <img
                                                    src={rank.car.imageUrl || "/placeholder.svg"}
                                                    alt={`${rank.car.brand} ${rank.car.name}`}
                                                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                                                />

                                                <div className="absolute top-3 right-3 flex items-center gap-1">
                                                    <Badge className="bg-accent text-accent-foreground">{rank.car.year}</Badge>

                                                    {rank.car.popular && (
                                                        <Badge className="bg-sky-500 text-accent-foreground">Popular</Badge>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="p-6">
                                                <div className="flex items-center justify-between mb-3">
                                                    <h3 className="text-xl font-bold text-foreground truncate">
                                                        {rank.car.brand} {rank.car.name}
                                                    </h3>
                                                    <span className="text-lg font-semibold text-accent text-nowrap">R$ {rank.car.fipe?.toFixed(3)}</span>
                                                </div>

                                                <div className="space-y-2 mb-4 text-sm text-muted-foreground">
                                                    <div className="flex justify-between gap-3">
                                                        <span>Motor:</span>
                                                        <span className="font-medium text-foreground truncate">{rank.car.specifications?.engine}</span>
                                                    </div>
                                                    <div className="flex justify-between gap-3">
                                                        <span>Potência:</span>
                                                        <span className="font-medium text-foreground truncate">{rank.car.specifications?.power}</span>
                                                    </div>
                                                    <div className="flex justify-between gap-3">
                                                        <span>Consumo:</span>
                                                        <span className="font-medium text-foreground truncate">{rank.car.specifications?.consumption}</span>
                                                    </div>
                                                </div>

                                                <section className="flex items-center gap-3 w-full">
                                                    <Dialog>
                                                        <DialogTrigger asChild>
                                                            <Button
                                                                disabled={loading}
                                                                className="w-full cursor-pointer flex-1 hover:bg-red-500/50
                                                                        bg-red-500/60 border border-red-500/70 text-red-700"
                                                            >
                                                                Remover do rank
                                                            </Button>
                                                        </DialogTrigger>
                                                        <DialogContent className={`${removingCarId === rank.carId && 'opacity-60 scale-105 transition-all duration-200'}`}>
                                                            <DialogTitle>Deletar Carro?</DialogTitle>
                                                            <DialogDescription>Deseja deletar o {rank.car.name} do ranking? essa ação não pode ser desfeita</DialogDescription>

                                                            <div className="flex items-center gap-1 mt-8">
                                                                <Button
                                                                    onClick={() => handleRemoveCarOnRank(rank.carId)}
                                                                    disabled={loading}
                                                                    variant={'destructive'}
                                                                    size={'sm'}
                                                                    className="cursor-pointer flex-1 hover:scale-y-105"
                                                                >
                                                                    <Trash />
                                                                    Deletar
                                                                </Button>

                                                                <DialogClose asChild>
                                                                    <Button variant={'secondary'} size={'sm'} className="cursor-pointer flex-1 hover:scale-y-105 bg-zinc-200 hover:bg-zinc-300/70">
                                                                        Cancelar
                                                                    </Button>
                                                                </DialogClose>
                                                            </div>

                                                            <DialogClose ref={dialogCloseRef} className="hidden" />
                                                        </DialogContent>
                                                    </Dialog>
                                                </section>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </section>
                        </section>
                    ) : activeTab === 'bodywork' ? (
                        <section className="w-full h-full max-h-[calc(100dvh)] overflow-y-auto px-5">
                            <div className="h-18 flex items-center justify-between gap-2 sticky top-0 z-20 bg-zinc-200/80 backdrop-blur-sm">
                                <div className="w-[100px]" />
                                <Input
                                    value={search}

                                    // onChange={(e) => setSearch(e.target.value)}

                                    placeholder="Pesquisar carrocerias"
                                    className="w-full max-w-160 text-zinc-700 bg-zinc-50 shadow-md hover:shadow-lg"
                                />

                                <Dialog>
                                    <DialogTrigger asChild>
                                        <Button className="cursor-pointer">
                                            <Plus className="md:mr-2 h-4 w-4" />
                                            <h1 className="max-md:hidden">Nova carroceria</h1>
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="sm:max-w-[425px]">
                                        <DialogHeader>
                                            <DialogTitle>Adicionar carroceria</DialogTitle>
                                            <DialogDescription></DialogDescription>
                                        </DialogHeader>

                                        <div className="grid gap-4 py-4">
                                            <Input
                                                value={brandData.brand_name}
                                                onChange={(e) => setBrandData({ ...brandData, brand_name: e.target.value })}
                                                placeholder="Nome da carroceria"
                                                type="text"
                                                required
                                                className="border-zinc-300 focus-visible:ring-2 focus-visible:ring-orange-500"
                                            />

                                            <Input
                                                value={brandData.img_url}
                                                onChange={(e) => setBrandData({ ...brandData, img_url: e.target.value })}
                                                placeholder="url da imagem da carroceria"
                                                type="text"
                                                required
                                                className="border-zinc-300 focus-visible:ring-2 focus-visible:ring-orange-500"
                                            />
                                        </div>

                                        <DialogFooter>
                                            <Button
                                                disabled={loading}
                                                type="button"
                                                onClick={handleCreateBodywork}
                                                className="w-full cursor-pointer bg-orange-600 hover:bg-orange-700 text-white"
                                            >
                                                Criar
                                            </Button>
                                            <DialogClose asChild>
                                                <button ref={bodyworkRef} className="hidden"></button>
                                            </DialogClose>
                                        </DialogFooter>
                                    </DialogContent>
                                </Dialog>

                            </div>
                            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                                {bodyworkStore.bodyworks.map(bodyworks => (
                                    <div className="flex flex-col items-center relative">
                                        <img src={bodyworks.image || ''} alt="" className="rounded-2xl object-cover h-50 w-full" />
                                        <h1 className="font-bold truncate">{bodyworks.name}</h1>
                                        <Dialog>
                                            <DialogTrigger asChild>
                                                <Button variant={'destructive'} className="bg-red-500/20 border border-red-500/70 rounded-full absolute right-2 top-2 cursor-pointer" size={'icon'}><Trash /></Button>
                                            </DialogTrigger>
                                            <DialogContent>
                                                <DialogHeader>
                                                    <DialogTitle>Deletar carroceria</DialogTitle>
                                                    <DialogDescription>Deseja realmente deletar essa carroceria?</DialogDescription>
                                                </DialogHeader>

                                                <section className="w-full flex items-center gap-3">
                                                    <Button disabled={loading} onClick={() => handleDeleteBodywork(bodyworks.id)} className="cursor-pointer flex-1 bg-red-500/40 text-red-800 hover:bg-red-500/50 border border-red-500/70">Deletar</Button>
                                                    <DialogClose asChild>
                                                        <Button ref={bodyworkRef} variant={'secondary'} className="flex-1 cursor-pointer">Cancelar</Button>
                                                    </DialogClose>
                                                </section>
                                            </DialogContent>
                                        </Dialog>
                                    </div>
                                ))}
                            </section>
                        </section>
                    ) : <p>404</p>}
                </main>
            )}
        </>
    )
}