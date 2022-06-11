import lume from 'lume/mod.ts'
import esbuild from 'lume/plugins/esbuild.ts'

const site = lume()

site.use(esbuild())
site.copy('images', '.')

export default site
