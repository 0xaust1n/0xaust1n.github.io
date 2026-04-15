'use strict'

const fs = require('fs')
const path = require('path')

const SOURCE_DIR = path.join(hexo.base_dir, 'source')
const REMOTE_DIMENSIONS = new Map([
  ['https://github.com/0xaust1n.png', { width: 500, height: 500 }],
  ['https://media2.giphy.com/media/13FrpeVH09Zrb2/giphy.gif?cid=ecf05e47i6nerqacg88ux9zpjknvwx9m7shcaoo00kmjonqz&rid=giphy.gif&ct=g', { width: 300, height: 289 }]
])

const dimensionCache = new Map()

const IMAGE_TAG_RE = /<img\b[^>]*>/gi
const ATTR_RE = /([^\s=]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+)))?/g

function parseAttributes(tag) {
  const attrs = {}
  let match

  while ((match = ATTR_RE.exec(tag))) {
    const [, name, doubleQuoted, singleQuoted, bare] = match
    if (name === 'img' || name === '/img') continue
    attrs[name] = doubleQuoted ?? singleQuoted ?? bare ?? ''
  }

  return attrs
}

function setAttribute(tag, name, value) {
  const attrRe = new RegExp(`\\s${name}=(?:"[^"]*"|'[^']*'|[^\\s>]+)`, 'i')
  if (attrRe.test(tag)) return tag.replace(attrRe, ` ${name}="${value}"`)
  return tag.replace(/\/?>$/, match => ` ${name}="${value}"${match}`)
}

function resolveLocalImage(src) {
  if (!src || /^(?:[a-z]+:)?\/\//i.test(src) || src.startsWith('data:')) return null

  let cleanSrc = src.split('#')[0].split('?')[0]
  if (cleanSrc.startsWith('/../')) cleanSrc = cleanSrc.slice(3)
  if (!cleanSrc.startsWith('/')) cleanSrc = `/${cleanSrc}`

  const filePath = path.join(SOURCE_DIR, cleanSrc.replace(/^\/+/, ''))
  return fs.existsSync(filePath) ? filePath : null
}

function getPngSize(buffer) {
  if (buffer.length < 24) return null
  return {
    width: buffer.readUInt32BE(16),
    height: buffer.readUInt32BE(20)
  }
}

function getGifSize(buffer) {
  if (buffer.length < 10) return null
  return {
    width: buffer.readUInt16LE(6),
    height: buffer.readUInt16LE(8)
  }
}

function getJpegSize(buffer) {
  let offset = 2

  while (offset < buffer.length) {
    if (buffer[offset] !== 0xFF) {
      offset += 1
      continue
    }

    const marker = buffer[offset + 1]
    if (!marker || marker === 0xD8 || marker === 0xD9) {
      offset += 2
      continue
    }

    const blockLength = buffer.readUInt16BE(offset + 2)
    if (blockLength < 2) break

    if (
      (marker >= 0xC0 && marker <= 0xC3) ||
      (marker >= 0xC5 && marker <= 0xC7) ||
      (marker >= 0xC9 && marker <= 0xCB) ||
      (marker >= 0xCD && marker <= 0xCF)
    ) {
      return {
        height: buffer.readUInt16BE(offset + 5),
        width: buffer.readUInt16BE(offset + 7)
      }
    }

    offset += 2 + blockLength
  }

  return null
}

function getImageDimensions(src) {
  if (dimensionCache.has(src)) return dimensionCache.get(src)

  let dimensions = REMOTE_DIMENSIONS.get(src) || null
  const filePath = resolveLocalImage(src)

  if (!dimensions && filePath) {
    const buffer = fs.readFileSync(filePath)

    if (buffer.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]))) {
      dimensions = getPngSize(buffer)
    } else if (buffer.subarray(0, 3).toString() === 'GIF') {
      dimensions = getGifSize(buffer)
    } else if (buffer[0] === 0xFF && buffer[1] === 0xD8) {
      dimensions = getJpegSize(buffer)
    }
  }

  dimensionCache.set(src, dimensions)
  return dimensions
}

hexo.extend.filter.register('after_render:html', html => {
  return html.replace(IMAGE_TAG_RE, tag => {
    const attrs = parseAttributes(tag)
    const src = attrs.src

    if (!src) return tag

    const dimensions = getImageDimensions(src)
    if (!dimensions) return tag

    let updatedTag = tag
    if (!attrs.width) updatedTag = setAttribute(updatedTag, 'width', dimensions.width)
    if (!attrs.height) updatedTag = setAttribute(updatedTag, 'height', dimensions.height)
    return updatedTag
  })
})
