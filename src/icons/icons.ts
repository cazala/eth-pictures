import { Tools } from 'react-sketch'
import { Contrast } from '../lib/contrast'

import pencilBlack from '../images/pencil-black.svg'
import lineBlack from '../images/line-black.svg'
import rectangleBlack from '../images/rectangle-black.svg'
import circleBlack from '../images/circle-black.svg'
import panBlack from '../images/pan-black.svg'
import selectBlack from '../images/select-black.svg'
import imageBlack from '../images/image-black.svg'
import textBlack from '../images/text-black.svg'

import pencilWhite from '../images/pencil-white.svg'
import lineWhite from '../images/line-white.svg'
import rectangleWhite from '../images/rectangle-white.svg'
import circleWhite from '../images/circle-white.svg'
import panWhite from '../images/pan-white.svg'
import selectWhite from '../images/select-white.svg'
import imageWhite from '../images/image-white.svg'
import textWhite from '../images/text-white.svg'

export const icons: Record<Contrast, Record<string, string>> = {
  [Contrast.BLACK]: {
    [Tools.Pencil]: pencilBlack,
    [Tools.Line]: lineBlack,
    [Tools.Rectangle]: rectangleBlack,
    [Tools.Circle]: circleBlack,
    [Tools.Pan]: panBlack,
    [Tools.Select]: selectBlack,
    image: imageBlack,
    text: textBlack,
  },
  [Contrast.WHITE]: {
    [Tools.Pencil]: pencilWhite,
    [Tools.Line]: lineWhite,
    [Tools.Rectangle]: rectangleWhite,
    [Tools.Circle]: circleWhite,
    [Tools.Pan]: panWhite,
    [Tools.Select]: selectWhite,
    image: imageWhite,
    text: textWhite,
  },
}
