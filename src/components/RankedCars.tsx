"use client"

import { Card, CardContent } from "./ui/card"

export default function RankedCars() {
    return (
        <main className="w-full bg-neutral-100 p-10">
            <section className="flex items-center gap-3">
                {Array.from({length: 10}).map((_, i) => (
                    <div className="flex-1">
                        <Card>
                            <CardContent>
                                <h1>{i + 1}</h1>
                            </CardContent>
                        </Card>
                    </div>
                ))}
            </section>
        </main>
    )
}