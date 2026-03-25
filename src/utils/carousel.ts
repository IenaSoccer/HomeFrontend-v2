interface CarouselInput {
  value?: {
    title?: string
    srcset: string[]
  }
}

interface CarouselItem {
  id: number
  type: 'image'
  value: {
    title: string
    src: string
  }
}

export const Carouselize = (
  data: CarouselInput | null | undefined
): CarouselItem[] | CarouselInput | null | undefined => {
  const final: CarouselItem[] = []

  if (data && data.value) {
    data.value.srcset.forEach((src, index) => {
      final.push({
        id: index,
        type: 'image',
        value: {
          title: data.value?.title ?? 'Album',
          src
        }
      })
    })
  }

  return final.length > 0 ? final : data
}