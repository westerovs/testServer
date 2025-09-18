import {localesHud} from './localesHud.js'
import View from './View.js'

const data = Object.entries(localesHud)


const view = new View('app')
view.render(data)

// «Анаграммы»
