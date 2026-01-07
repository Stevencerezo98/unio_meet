'use client';
import { useState } from 'react';
import { useForm, useFieldArray, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { LandingContent } from '@/lib/landing-content';
import { saveLandingContent } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Trash } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const linkSchema = z.object({
  text: z.string().min(1, 'Link text is required'),
  url: z.string().url('Must be a valid URL'),
});

const socialLinkSchema = z.object({
  name: z.string().min(1, 'Social media name is required'),
  url: z.string().url('Must be a valid URL'),
});

const featureItemSchema = z.object({
  icon: z.string().min(1, 'Icon name is required'),
  title: z.string().min(1, 'Feature title is required'),
  description: z.string().min(1, 'Feature description is required'),
});

const landingContentSchema = z.object({
  hero: z.object({
    title: z.string().min(1, 'Hero title is required'),
    subtitle: z.string().min(1, 'Hero subtitle is required'),
    ctaPrimary: z.string().min(1, 'Primary CTA is required'),
    ctaSecondary: z.string().min(1, 'Secondary CTA is required'),
    cardTitle: z.string().min(1, 'Card title is required'),
    cardDescription: z.string().min(1, 'Card description is required'),
  }),
  features: z.object({
    title: z.string().min(1, 'Features title is required'),
    subtitle: z.string().min(1, 'Features subtitle is required'),
    items: z.array(featureItemSchema),
  }),
  footer: z.object({
    brandName: z.string().min(1, 'Brand name is required'),
    brandDescription: z.string().min(1, 'Brand description is required'),
    socialLinks: z.array(socialLinkSchema),
    linkColumns: z.array(
      z.object({
        title: z.string().min(1, 'Column title is required'),
        links: z.array(linkSchema),
      })
    ),
    legalLinks: z.array(linkSchema),
    copyright: z.string().min(1, 'Copyright text is required'),
  }),
});

interface AdminFormProps {
  content: LandingContent;
}

export function AdminForm({ content }: AdminFormProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const formMethods = useForm<LandingContent>({
    resolver: zodResolver(landingContentSchema),
    defaultValues: content,
  });

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = formMethods;

  const {
    fields: featureFields,
    append: appendFeature,
    remove: removeFeature,
  } = useFieldArray({
    control,
    name: 'features.items',
  });

  const {
    fields: socialFields,
    append: appendSocial,
    remove: removeSocial,
  } = useFieldArray({
    control,
    name: 'footer.socialLinks',
  });

   const {
    fields: legalFields,
    append: appendLegal,
    remove: removeLegal,
  } = useFieldArray({
    control,
    name: 'footer.legalLinks',
  });

  const { fields: columnFields, remove: removeColumn, append: appendColumn} = useFieldArray({
    control,
    name: 'footer.linkColumns',
  });


  const onSubmit = async (data: LandingContent) => {
    setIsLoading(true);
    try {
      const result = await saveLandingContent(data);
      if (result.success) {
        toast({ title: 'Success!', description: 'Content saved successfully.' });
      } else {
        toast({
          variant: 'destructive',
          title: 'Error saving content',
          description: result.error,
        });
      }
    } catch (e: any) {
      toast({
        variant: 'destructive',
        title: 'An unexpected error occurred.',
        description: e.message || 'Please try again later.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <FormProvider {...formMethods}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <Accordion type="multiple" defaultValue={['hero', 'features', 'footer']} className="w-full">
          {/* Hero Section */}
          <AccordionItem value="hero">
            <AccordionTrigger className="text-xl font-bold">Hero Section</AccordionTrigger>
            <AccordionContent>
              <Card className="border-none">
                <CardContent className="pt-6 space-y-4">
                  <div>
                    <Label htmlFor="hero.title">Title</Label>
                    <Input id="hero.title" {...register('hero.title')} />
                    {errors.hero?.title && <p className="text-destructive text-sm mt-1">{errors.hero.title.message}</p>}
                  </div>
                  <div>
                    <Label htmlFor="hero.subtitle">Subtitle</Label>
                    <Textarea id="hero.subtitle" {...register('hero.subtitle')} />
                    {errors.hero?.subtitle && <p className="text-destructive text-sm mt-1">{errors.hero.subtitle.message}</p>}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="hero.ctaPrimary">Primary Button Text</Label>
                      <Input id="hero.ctaPrimary" {...register('hero.ctaPrimary')} />
                      {errors.hero?.ctaPrimary && <p className="text-destructive text-sm mt-1">{errors.hero.ctaPrimary.message}</p>}
                    </div>
                    <div>
                      <Label htmlFor="hero.ctaSecondary">Secondary Button Text</Label>
                      <Input id="hero.ctaSecondary" {...register('hero.ctaSecondary')} />
                      {errors.hero?.ctaSecondary && <p className="text-destructive text-sm mt-1">{errors.hero.ctaSecondary.message}</p>}
                    </div>
                  </div>
                   <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="hero.cardTitle">Card Title</Label>
                        <Input id="hero.cardTitle" {...register('hero.cardTitle')} />
                        {errors.hero?.cardTitle && <p className="text-destructive text-sm mt-1">{errors.hero.cardTitle.message}</p>}
                      </div>
                      <div>
                        <Label htmlFor="hero.cardDescription">Card Description</Label>
                        <Input id="hero.cardDescription" {...register('hero.cardDescription')} />
                        {errors.hero?.cardDescription && <p className="text-destructive text-sm mt-1">{errors.hero.cardDescription.message}</p>}
                      </div>
                  </div>
                </CardContent>
              </Card>
            </AccordionContent>
          </AccordionItem>

          {/* Features Section */}
          <AccordionItem value="features">
            <AccordionTrigger className="text-xl font-bold">Features Section</AccordionTrigger>
            <AccordionContent>
              <Card className="border-none">
                <CardContent className="pt-6 space-y-4">
                    <div>
                        <Label htmlFor="features.title">Section Title</Label>
                        <Input id="features.title" {...register('features.title')} />
                        {errors.features?.title && <p className="text-destructive text-sm mt-1">{errors.features.title.message}</p>}
                    </div>
                     <div>
                        <Label htmlFor="features.subtitle">Section Subtitle</Label>
                        <Textarea id="features.subtitle" {...register('features.subtitle')} />
                        {errors.features?.subtitle && <p className="text-destructive text-sm mt-1">{errors.features.subtitle.message}</p>}
                    </div>

                    <h3 className="text-lg font-semibold mt-4">Feature Items</h3>
                     {featureFields.map((field, index) => (
                        <Card key={field.id} className="p-4 relative">
                            <div className="space-y-2">
                                <div>
                                    <Label>Icon Name (from lucide-react)</Label>
                                    <Input {...register(`features.items.${index}.icon`)} placeholder="e.g., Lock, Zap, TvMinimal"/>
                                    {errors.features?.items?.[index]?.icon && <p className="text-destructive text-sm mt-1">{errors.features.items[index].icon?.message}</p>}
                                </div>
                                <div>
                                    <Label>Title</Label>
                                    <Input {...register(`features.items.${index}.title`)} />
                                    {errors.features?.items?.[index]?.title && <p className="text-destructive text-sm mt-1">{errors.features.items[index].title?.message}</p>}
                                </div>
                                <div>
                                    <Label>Description</Label>
                                    <Textarea {...register(`features.items.${index}.description`)} />
                                    {errors.features?.items?.[index]?.description && <p className="text-destructive text-sm mt-1">{errors.features.items[index].description?.message}</p>}
                                </div>
                            </div>
                            <Button type="button" variant="destructive" size="icon" className="absolute top-2 right-2 h-6 w-6" onClick={() => removeFeature(index)}>
                                <Trash className="h-4 w-4" />
                            </Button>
                        </Card>
                    ))}
                    <Button type="button" variant="outline" onClick={() => appendFeature({ icon: '', title: '', description: '' })}>
                        Add Feature
                    </Button>
                </CardContent>
              </Card>
            </AccordionContent>
          </AccordionItem>

          {/* Footer Section */}
          <AccordionItem value="footer">
            <AccordionTrigger className="text-xl font-bold">Footer Section</AccordionTrigger>
            <AccordionContent>
                <Card className="border-none">
                    <CardContent className="pt-6 space-y-6">
                        {/* Brand Details */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold">Brand Details</h3>
                            <div>
                                <Label>Brand Name</Label>
                                <Input {...register('footer.brandName')} />
                                {errors.footer?.brandName && <p className="text-destructive text-sm mt-1">{errors.footer.brandName.message}</p>}
                            </div>
                             <div>
                                <Label>Brand Description</Label>
                                <Input {...register('footer.brandDescription')} />
                                {errors.footer?.brandDescription && <p className="text-destructive text-sm mt-1">{errors.footer.brandDescription.message}</p>}
                            </div>
                        </div>

                        {/* Social Links */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold">Social Media Links</h3>
                            {socialFields.map((field, index) => (
                                <Card key={field.id} className="p-4 relative">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <Label>Icon Name</Label>
                                            <Input {...register(`footer.socialLinks.${index}.name`)} placeholder="e.g., Facebook, TikTok"/>
                                            {errors.footer?.socialLinks?.[index]?.name && <p className="text-destructive text-sm mt-1">{errors.footer.socialLinks[index].name?.message}</p>}
                                        </div>
                                         <div>
                                            <Label>URL</Label>
                                            <Input {...register(`footer.socialLinks.${index}.url`)} placeholder="https://..."/>
                                            {errors.footer?.socialLinks?.[index]?.url && <p className="text-destructive text-sm mt-1">{errors.footer.socialLinks[index].url?.message}</p>}
                                        </div>
                                    </div>
                                    <Button type="button" variant="destructive" size="icon" className="absolute top-2 right-2 h-6 w-6" onClick={() => removeSocial(index)}>
                                        <Trash className="h-4 w-4" />
                                    </Button>
                                </Card>
                            ))}
                             <Button type="button" variant="outline" onClick={() => appendSocial({ name: '', url: '' })}>
                                Add Social Link
                            </Button>
                        </div>

                        {/* Link Columns */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold">Footer Link Columns</h3>
                            {columnFields.map((column, colIndex) => {
                                const { fields: linkFields, append: appendLink, remove: removeLink } = useFieldArray({
                                    control,
                                    name: `footer.linkColumns.${colIndex}.links`,
                                });

                                return (
                                    <Card key={column.id} className="p-4 relative">
                                        <div className="space-y-2">
                                            <Label>Column Title</Label>
                                            <Input {...register(`footer.linkColumns.${colIndex}.title`)} />
                                            <hr className="my-4" />
                                            <h4 className="font-medium">Links in this column:</h4>
                                            
                                            <div className="space-y-2">
                                                {linkFields.map((link, linkIndex) => (
                                                    <div key={link.id} className="flex items-center gap-2">
                                                        <Input
                                                            {...register(`footer.linkColumns.${colIndex}.links.${linkIndex}.text`)}
                                                            placeholder="Link Text"
                                                            className="flex-1"
                                                        />
                                                        <Input
                                                            {...register(`footer.linkColumns.${colIndex}.links.${linkIndex}.url`)}
                                                            placeholder="URL"
                                                            className="flex-1"
                                                        />
                                                        <Button
                                                            type="button"
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => removeLink(linkIndex)}
                                                        >
                                                            <Trash className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                ))}
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => appendLink({ text: '', url: '#' })}
                                                >
                                                    Add Link
                                                </Button>
                                            </div>
                                        </div>
                                         <Button type="button" variant="destructive" size="icon" className="absolute top-2 right-2 h-6 w-6" onClick={() => removeColumn(colIndex)}>
                                            <Trash className="h-4 w-4" />
                                        </Button>
                                    </Card>
                                )
                            })}
                             <Button type="button" variant="outline" onClick={() => appendColumn({ title: '', links: [{text: '', url: ''}] })}>
                                Add Link Column
                            </Button>
                        </div>
                        
                        {/* Legal Links & Copyright */}
                        <div className="space-y-4">
                          <h3 className="text-lg font-semibold">Legal Links & Copyright</h3>
                           {legalFields.map((field, index) => (
                                <Card key={field.id} className="p-4 relative">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <Label>Link Text</Label>
                                            <Input {...register(`footer.legalLinks.${index}.text`)} />
                                        </div>
                                         <div>
                                            <Label>URL</Label>
                                            <Input {...register(`footer.legalLinks.${index}.url`)} />
                                        </div>
                                    </div>
                                    <Button type="button" variant="destructive" size="icon" className="absolute top-2 right-2 h-6 w-6" onClick={() => removeLegal(index)}>
                                        <Trash className="h-4 w-4" />
                                    </Button>
                                </Card>
                            ))}
                            <Button type="button" variant="outline" onClick={() => appendLegal({ text: '', url: '' })}>
                                Add Legal Link
                            </Button>

                             <div className="pt-4">
                                <Label>Copyright Text</Label>
                                <Input {...register('footer.copyright')} placeholder="© {year} Unio, Inc." />
                                <p className="text-xs text-muted-foreground mt-1">Use {'{year}'} to automatically insert the current year.</p>
                            </div>
                        </div>

                    </CardContent>
                </Card>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <Button type="submit" size="lg" className="w-full mt-8" disabled={isLoading}>
          {isLoading ? 'Saving...' : 'Save All Changes'}
        </Button>
      </form>
    </FormProvider>
  );
}
