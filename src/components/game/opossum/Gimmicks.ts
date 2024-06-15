import GimmickSource from '../../../assets/gimmick/gimmick.txt?raw'


const gimmicks = (GimmickSource as string).split('\n').filter(s => s.length > 0)

let currentGimmick = -1

function nextGimmick() {
    // console.log('randon', randomIntFromInterval(0, gimmicks.length - 1))
    // return randomIntFromInterval(0, gimmicks.length - 1)
    currentGimmick++
    if (currentGimmick >= gimmicks.length) {
        currentGimmick = 0
    }
    return currentGimmick
}

function splitInLines(sentence: string, maxLine = 2): string[] {
    const rowLimit = Math.round(sentence.length / maxLine)
    const lines: string[] = []
    let currentLine = 0

    for (const word of sentence.split(' ')) {
        lines[currentLine] = (lines[currentLine] || '') + word + ' '
        if (lines[currentLine].length >= rowLimit && currentLine < maxLine) {
            currentLine++
        }
    }
    return lines.map(line => line.trim())
}

export function getGimmick(lineSplit = 2): string[] {
    return splitInLines(gimmicks[nextGimmick()])
}