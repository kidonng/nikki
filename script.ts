import PhotoSwipe, { type SlideData } from 'photoswipe'
import dayjs from 'dayjs'
import dayOfYear from 'dayjs/plugin/dayOfYear'
import type {} from 'dayjs/plugin/dayOfYear.d.ts'

dayjs.extend(dayOfYear)

const today = dayjs().dayOfYear()
const getIndex = () => {
    const hash = parseInt(location.hash.slice(1))
    return (Number.isNaN(hash) ? today : Math.min(Math.max(1, hash), 365)) - 1
}

// https://avif.io/blog/tutorials/css/#avifsupportdetectionscript
const image = new Image()
const format = await new Promise<string>((resolve) => {
    image.addEventListener('load', () => resolve('avif'))
    image.addEventListener('error', () => resolve('webp'))
    image.src =
        'data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAAB0AAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAIAAAACAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQ0MAAAAABNjb2xybmNseAACAAIAAYAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAACVtZGF0EgAKCBgANogQEAwgMg8f8D///8WfhwB8+ErK42A='
})

const pswp = new PhotoSwipe({
    dataSource: [...Array(365).keys()].map(
        (i) =>
            (i <= 125 || i >= 150
                ? {
                      src: `/${i + 1}.${format}`,
                      width: 1080,
                      height: 1350,
                  }
                : {
                      html: `
                        <div style="display: flex; height: 100%; justify-content: center; align-items: center;">
                            <span style="font-size: 5rem; filter: invert(1);">🔜</span>
                        </div>
                      `,
                  }) as SlideData
    ),
    index: getIndex(),
    bgOpacity: 1,
})
window.addEventListener('hashchange', () => pswp.goTo(getIndex()))

const { title } = document
pswp.on('change', () => {
    const curr = pswp.currIndex + 1
    location.hash = curr === today ? '' : String(curr)
    document.title = `${dayjs().dayOfYear(curr).format('MMM D')} - ${title}`
})
pswp.init()
