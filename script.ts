import PhotoSwipe, { type SlideData } from 'photoswipe'
import { DateTime } from 'luxon'

const now = DateTime.now()
const today = now.isInLeapYear && now.month > 2 ? now.ordinal - 1 : now.ordinal
const isLeapDay = now.month === 2 && now.day === 29
const date = (ordinal: number) =>
    DateTime.fromObject({
        year: ordinal >= 151 ? 2021 : 2022,
        ordinal,
    }).toFormat('MMM d')

const available = (no: number) => no <= 126 || no >= 151
const random = () => Math.floor(Math.random() * 365) + 1

// https://avif.io/blog/tutorials/css/#avifsupportdetectionscript
const format = await new Promise<string>((resolve) => {
    const image = new Image()
    image.addEventListener('load', () => resolve('avif'))
    image.addEventListener('error', () => resolve('webp'))
    image.src =
        'data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAAB0AAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAIAAAACAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQ0MAAAAABNjb2xybmNseAACAAIAAYAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAACVtZGF0EgAKCBgANogQEAwgMg8f8D///8WfhwB8+ErK42A='
})

const dataSource = [...Array(365).keys()].map((index) => {
    const no = index + 1
    return (
        available(no)
            ? {
                  src: `${no}.${format}`,
                  width: 1080,
                  height: 1350,
                  alt: date(no),
              }
            : { html: '<div class="center large">🔜</div>' }
    ) as SlideData
})

const link = document.querySelector<HTMLAnchorElement>('#link')!
link.hash = isLeapDay ? 'random' : String(today)

if (!isLeapDay && available(today)) {
    const img = document.querySelector<HTMLImageElement>('#img')!
    const { src, alt } = dataSource[today - 1]
    img.src = src!
    img.alt = alt!
} else {
    link.textContent = isLeapDay ? '🎲' : '🔜'
    link.classList.add('large', 'no-underline')
}

let pswp: PhotoSwipe | undefined
const { title } = document

const init = (index: number) => {
    pswp = new PhotoSwipe({
        dataSource,
        index,
        bgOpacity: 1,
    })

    pswp.on('change', () => (location.hash = String(pswp!.currIndex + 1)))
    pswp.on('close', () => (location.hash = ''))
    pswp.on('uiRegister', () =>
        pswp!.ui.registerElement({
            name: 'random',
            html: '<a class="no-underline" href="#random">🎲</a>',
            ariaLabel: 'Random',
            order: 11,
            isButton: true,
        })
    )

    pswp.init()
}

const hash = () => {
    const hash = location.hash.slice(1)
    if (hash === '') {
        if (!isLeapDay) document.title = `${date(today)} - ${title}`
        if (pswp && !pswp.isDestroying) pswp.close()
        return
    }
    if (hash === 'random') return location.replace(`#${random()}`)

    const no = parseInt(hash)
    if (Number.isNaN(no) || no < 1 || no > 365) return

    const index = no - 1
    document.title = `${date(no)} - ${title}`
    if (!pswp || pswp.isDestroying) init(index)
    else pswp.goTo(index)
}
hash()
window.addEventListener('hashchange', hash)
