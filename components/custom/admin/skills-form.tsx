"use client"

import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { EditSkillSchema, SkillSchema } from "@/lib/schema";
import { createClient } from "@/utils/supabase/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Pencil, Plus } from "lucide-react";
import { useEffect, useRef, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { AsyncStrictCombobox } from "../combobox";
import { ComboboxItem } from "@/lib/types";
import { addSkill, deleteSkills, editSkill } from "@/actions/skills";
import { toast } from "@/hooks/use-toast";

function AddSkillForm() {
  const [isPending, startTransition] = useTransition()
  const [categories, setCategories] = useState<ComboboxItem[]>([])
  const form = useForm<z.infer<typeof SkillSchema>>({
    resolver: zodResolver(SkillSchema),
    defaultValues: {
      name: '',
      skill_category_id: '',
    }
  })

  function onSubmit() {
    startTransition(() => {
      addSkill(form.getValues()).then(({ error, success }) => {
        if (error) return toast({ title: error.message, variant: "destructive" })
        toast({ title: success, variant: "success" })
      })
    })
  }

  function selectCategory(value: string) {
    form.setValue('skill_category_id', value)
  }

  useEffect(() => {
    createClient()
      .from('skill_categories')
      .select('*')
      .then(({ data }) => {
        if (!data?.length) return
        setCategories(data.map(({ id, name }) => ({ value: `${id}|${name}`, label: name })))
      })
  }, [])

  return (
    <Form {...form}>
      <form id="add-skill-form" className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  disabled={isPending}
                  placeholder="Enter skill name..."
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="skill_category_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <AsyncStrictCombobox
                  items={categories}
                  placeholder="Select skill category..."
                  value={field.value}
                  onValueChange={selectCategory}
                  disabled={isPending}
                />
              </FormControl>
            </FormItem>
          )}
        />
      </form>
      <DialogFooter>
        <DialogClose asChild>
          <Button variant="secondary" disabled={isPending}>Cancel</Button>
        </DialogClose>
        <Button disabled={isPending} form="add-skill-form">Submit</Button>
      </DialogFooter>
    </Form>
  )
}

interface EditSkillFormProps {
  skill: Record<string, any>
}
function EditSkillForm({ skill }: EditSkillFormProps) {
  const [isPending, startTransition] = useTransition()
  const [categories, setCategories] = useState<ComboboxItem[]>([])
  const dialogCloser = useRef<HTMLButtonElement>(null)
  const form = useForm<z.infer<typeof EditSkillSchema>>({
    resolver: zodResolver(EditSkillSchema),
    defaultValues: {
      id: skill.id,
      name: skill.name,
      skill_category_id: skill.skill_category_id,
    }
  })

  function onSubmit() {
    console.log(form.getValues())
    startTransition(() => {
      editSkill(form.getValues()).then(({ error, success }) => {
        if (error) return toast({ title: error.message, variant: "destructive" })
        dialogCloser.current?.click()
        toast({ title: success, variant: "success" })
      })
    })
  }

  function selectCategory(value: string) {
    form.setValue('skill_category_id', value)
  }

  function deleteSkill() {
    startTransition(() => {
      deleteSkills([skill.id]).then(({ error, success }) => {
        if (error) return toast({ title: error.message, variant: "destructive" })
        dialogCloser?.current?.click()
        toast({ title: success, variant: "success" })
      })
    })
  }

  useEffect(() => {
    createClient()
      .from('skill_categories')
      .select('*')
      .then(({ data }) => {
        if (!data?.length) return

        setCategories(data.map(({ id, name }) => ({ value: `${id}|${name}`, label: name })))
        const selectedCategory = data.find(({ id }) => id === skill.skill_category_id)
        form.reset({
          ...form.getValues(),
          skill_category_id: selectedCategory ? `${selectedCategory.id}|${selectedCategory.name}` : '',
        })
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Form {...form}>
      <form id="edit-skill-form" className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  disabled={isPending}
                  placeholder="Enter skill name..."
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="skill_category_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <FormControl>
                <AsyncStrictCombobox
                  items={categories}
                  placeholder="Select skill category..."
                  value={field.value}
                  onValueChange={selectCategory}
                  disabled={isPending}
                />
              </FormControl>
            </FormItem>
          )}
        />
      </form>
      <DialogFooter>
        <DialogClose ref={dialogCloser} />
        <Button variant="destructive" type="button" disabled={isPending} onClick={deleteSkill}>Delete</Button>
        <Button type="submit" disabled={isPending} form="edit-skill-form" onClick={() => onSubmit()}>Save</Button>
      </DialogFooter>
    </Form>
  )
}

interface SkillFormProps {
  skill?: Record<string, any>
}
export function SkillForm({ skill }: SkillFormProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm">
          {!!skill ? (
            <Pencil size={16} />
          ) : (
            <><Plus size={16} /> Add Skill</>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{!!skill ? 'Edit' : 'Add'} Skill</DialogTitle>
          <DialogDescription>{!!skill ? 'Update' : 'Fill'} the required information below</DialogDescription>
        </DialogHeader>
        {!!skill ? <EditSkillForm skill={skill} /> : <AddSkillForm />}
      </DialogContent>
    </Dialog >
  )
}
