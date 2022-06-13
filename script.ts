import PhotoSwipe, { type SlideData } from 'photoswipe'
import dayjs from 'dayjs'
import dayOfYear from 'dayjs/plugin/dayOfYear'
import type {} from 'dayjs/plugin/dayOfYear.d.ts'
import isLeapYear from 'dayjs/plugin/isLeapYear'
import type {} from 'dayjs/plugin/isLeapYear.d.ts'

dayjs.extend(dayOfYear)
dayjs.extend(isLeapYear)

const d = dayjs()
const today =
    d.isLeapYear() && d.month() > 1 ? d.dayOfYear() - 1 : d.dayOfYear()
const date = (day: number) => dayjs().dayOfYear(day).format('MMM D')
const available = (day: number) => day <= 126 || day >= 151
const random = () => Math.floor(Math.random() * 365) + 1

// https://avif.io/blog/tutorials/css/#avifsupportdetectionscript
const image = new Image()
const format = await new Promise<string>((resolve) => {
    image.addEventListener('load', () => resolve('avif'))
    image.addEventListener('error', () => resolve('webp'))
    image.src =
        'data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAAB0AAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAIAAAACAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQ0MAAAAABNjb2xybmNseAACAAIAAYAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAACVtZGF0EgAKCBgANogQEAwgMg8f8D///8WfhwB8+ErK42A='
})

const link = document.querySelector<HTMLAnchorElement>('#link')!
const img = document.querySelector<HTMLImageElement>('#img')!

if (d.month() === 1 && d.date() === 29) {
    link.hash = String(random())
    link.textContent = '🎲'
    link.classList.add('large', 'no-underline')
} else {
    link.hash = String(today)
    img.src = `/${today}.${format}`
    img.alt = date(today)
}

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
            : { html: '<div class="center large">🔜</div>' }
    ) as SlideData
})

let pswp: PhotoSwipe
const { title } = document

const init = (index: number) => {
    pswp = new PhotoSwipe({
        dataSource,
        index,
        bgOpacity: 1,
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
            onClick: () => pswp.goTo(random() - 1),
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
