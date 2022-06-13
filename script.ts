import PhotoSwipe, { type SlideData } from 'photoswipe'
import { DateTime } from 'luxon'

const now = DateTime.now()
const date = (ordinal: number) =>
    DateTime.fromObject({ year: 2022, ordinal }).toFormat('MMM d')
const available = (no: number) => no <= 126 || no >= 151
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

if (now.month === 2 && now.day === 29) {
    link.hash = String(random())
    link.textContent = '🎲'
    link.classList.add('large', 'no-underline')
} else {
    const no = now.isInLeapYear && now.month > 2 ? now.ordinal - 1 : now.ordinal
    link.hash = String(no)
    img.src = `/${no}.${format}`
    img.alt = date(no)
}

const dataSource = [...Array(365).keys()].map((index) => {
    const no = index + 1
    return (
        available(no)
            ? {
                  src: `/${no}.${format}`,
                  width: 1080,
                  height: 1350,
                  alt: date(no),
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
        const no = pswp.currIndex + 1
        location.hash = String(no)
        document.title = `${date(no)} - ${title}`
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
    const no = parseInt(location.hash.slice(1))
    if (!Number.isNaN(no) && no >= 1 && no <= 365) {
        const index = no - 1
        if (!pswp || pswp.isDestroying) init(index)
        else pswp.goTo(index)
    }
}
hash()
window.addEventListener('hashchange', hash)
