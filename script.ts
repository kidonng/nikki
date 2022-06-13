import PhotoSwipe, { type SlideData } from 'photoswipe'
import dayjs from 'dayjs'
import dayOfYear from 'dayjs/plugin/dayOfYear'
import type {} from 'dayjs/plugin/dayOfYear.d.ts'

dayjs.extend(dayOfYear)

const today = dayjs().dayOfYear()
const date = (day: number) => dayjs().dayOfYear(day).format('MMM D')
const available = (day: number) => day <= 126 || day >= 151

// https://avif.io/blog/tutorials/css/#avifsupportdetectionscript
const image = new Image()
const format = await new Promise<string>((resolve) => {
    image.addEventListener('load', () => resolve('avif'))
    image.addEventListener('error', () => resolve('webp'))
    image.src =
        'data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAAB0AAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAIAAAACAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQ0MAAAAABNjb2xybmNseAACAAIAAYAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAACVtZGF0EgAKCBgANogQEAwgMg8f8D///8WfhwB8+ErK42A='
})

document.querySelector<HTMLAnchorElement>('#link')!.hash = String(today)
const img = document.querySelector<HTMLImageElement>('#img')!
img.src = `/${today}.${format}`
img.alt = date(today)

const dataSource = [...Array(365).keys()].map((index) => {
    const day = index + 1
    return (
        available(day)
            ? {
                  src: `/${day}.${format}`,
                  width: 1080,
                  height: 1350,
                  alt: date(day),
              }
            : {
                  html: `
                        <div style="display: flex; height: 100%; justify-content: center; align-items: center;">
                            <span style="font-size: 5rem; filter: invert(1);">🔜</span>
                        </div>
                      `,
              }
    ) as SlideData
})

let pswp: PhotoSwipe
const { title } = document

const init = (index: number) => {
    pswp = new PhotoSwipe({
        dataSource,
        index,
    })
    pswp.on('change', () => {
        const day = pswp.currIndex + 1
        location.hash = String(day)
        document.title = `${date(day)} - ${title}`
    })
    pswp.on('close', () => {
        location.hash = ''
        document.title = title
    })
    pswp.on('uiRegister', () =>
        pswp.ui.registerElement({
            html: '<span style="font-size: 20px;">🎲</span>',
            ariaLabel: 'Random',
            order: 11,
            isButton: true,
            onClick: () => pswp.goTo(Math.floor(Math.random() * 365)),
        })
    )
    pswp.init()
}

const hash = () => {
    const day = parseInt(location.hash.slice(1))
    if (!Number.isNaN(day) && day >= 1 && day <= 365) {
        const index = day - 1
        if (!pswp || pswp.isDestroying) init(index)
        else pswp.goTo(index)
    }
}
hash()
window.addEventListener('hashchange', hash)
