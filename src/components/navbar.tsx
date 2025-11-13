"use client"

import { LogOut, Search, Trophy, User, User2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { signOut, useSession } from "next-auth/react"
import { useLayout } from "@/stores/layout"
import { useEffect, useState } from "react"
import { useCarsStore } from "@/stores/cars"
import { useSnapshot } from "valtio"

export function Navbar() {
  const [searchValue, setSearchValue] = useState('')
  const { data: session } = useSession();
  const carsStore = useSnapshot(useCarsStore)

  const handleLogOut = () => {
    signOut()
  }

  useEffect(() => {
    useLayout.isSearching = true
    useCarsStore.searchedCars = carsStore.cars.filter(car =>
      car.name.toLowerCase().includes(searchValue.toLowerCase()) || 
      car.brand.toLowerCase().includes(searchValue.toLowerCase())
    );

    if(searchValue === ''){
      useLayout.isSearching = false
    }
  }, [searchValue, carsStore.cars]);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-zinc-50/70 backdrop-blur-xs border-b border-border">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-2 max-md:hidden">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-lg">C</span>
          </div>
          <Link href={'/'} className="font-bold text-xl text-foreground">Carrologia</Link>
        </div>

        <div className="flex-1 max-w-2xl mx-8 ">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              onFocus={() => useLayout.isSearching = true}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="Buscar modelos de carros..."
              className="pl-10 bg-muted/50 border-border focus:border-primary"
            />
          </div>
        </div>

        <section className="flex gap-2 items-center">
          {session?.user?.role !== 'USER' && (
            <Link href={'/admin'}>
              <Button variant="outline" className="flex items-center space-x-2 bg-transparent cursor-pointer">
                <Trophy className="w-4 h-4" />
                <span>admin</span>
              </Button>
            </Link>
          )}

          {!session?.user ? (
            <Link href={'/login'}>
              <Button variant="outline" className="flex items-center space-x-2 bg-transparent cursor-pointer">
                <User className="w-4 h-4" />
                <span>Login</span>
              </Button>
            </Link>
          ) : (
            <div className="flex items-center gap-2">
              <div className="text-md max-md:hidden truncate font-bold px-4 cursor-pointer hover:scale-x-105 transition-all duration-200 py-1 bg-green-500/20 rounded-full border border-green-500 flex items-center gap-1">
                <User2 className="size-4" />
                {session.user.name}
              </div>

              <Button onClick={handleLogOut} variant={'destructive'} size={'icon'} className="cursor-pointer size-8">
                <LogOut />
              </Button>
            </div>
          )}
        </section>
      </div>
    </nav>
  )
}
