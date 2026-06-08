import { Field, FieldLabel } from '@/components/ui/field'
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from '@/components/ui/combobox'
import { curriculumFilters } from '@/lib/curriculum-data'

export function CurriculumFilters() {
  return (
    <div className="grid gap-3 md:grid-cols-3">
      <DisabledFilter label="Sede" value="campus" displayValue={curriculumFilters.campus} />
      <DisabledFilter label="Carrera" value="career" displayValue={curriculumFilters.career} />
      <DisabledFilter label="Plan" value="plan" displayValue={curriculumFilters.plan} />
    </div>
  )
}

function DisabledFilter({ label, value, displayValue }: { label: string; value: string; displayValue: string }) {
  const items = [displayValue]

  return (
    <Field data-disabled>
      <FieldLabel>{label}</FieldLabel>
      <Combobox items={items} value={displayValue} onValueChange={() => undefined}>
        <ComboboxInput value={displayValue} disabled className="w-full" />
        <ComboboxContent>
          <ComboboxEmpty>No se encontraron resultados.</ComboboxEmpty>
          <ComboboxList>
            {(item) => (
              <ComboboxItem key={`${value}-${item}`} value={item}>
                {item}
              </ComboboxItem>
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
    </Field>
  )
}
