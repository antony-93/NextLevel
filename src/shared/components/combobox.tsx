"use client"

import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/shared/utils/utils"
import { Button } from "@/shared/components/ui/button"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/shared/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/shared/components/ui/popover"
import { useMemo, useState } from "react"

type ComboboxProps<T> = {
    valueField: keyof T
    labelField: keyof T
    emptyMessage: string
    searchPlaceholder: string
    value: T[keyof T]
    onChange: (value: T[keyof T] | null) => void
    items: T[]
}

export function Combobox<T>({ value, onChange, valueField, labelField, emptyMessage, searchPlaceholder, items }: ComboboxProps<T>) {
    const [
        open,
        setOpen
    ] = useState(false)

    const handleChange = (value: any) => {
        onChange(value)
        setOpen(false)
    }

    const selectedLabel = useMemo(() => {
        if (!value) return null

        const item = items.find(item => item[valueField] === value)

        return item ? String(item[labelField]) : null
    }, [value, items, valueField, labelField])

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-[200px] justify-between"
                >
                    {selectedLabel || <span className="opacity-50">{searchPlaceholder}</span>}
                    <ChevronsUpDown className="opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
                <Command>
                    <CommandInput placeholder={searchPlaceholder} className="h-9" />
                    <CommandList>
                        <CommandEmpty>{emptyMessage}</CommandEmpty>
                        <CommandGroup>
                            {items.map((item) => {
                                const itemValue = item[valueField],
                                    itemLabel = item[labelField],
                                    isSelected = value === itemValue;

                                return (
                                    <CommandItem
                                        key={String(itemValue)}
                                        value={String(itemValue)}
                                        onSelect={() => handleChange(itemValue)}
                                    >
                                        {String(itemLabel)}
                                        <Check className={cn("ml-auto h-4 w-4", isSelected ? "opacity-100" : "opacity-0")} />
                                    </CommandItem>
                                )
                            })}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}
