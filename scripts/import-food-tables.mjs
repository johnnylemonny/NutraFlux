import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import { XMLParser } from 'fast-xml-parser'

const scriptDir = dirname(fileURLToPath(import.meta.url))
const projectRoot = resolve(scriptDir, '..')
const sourceDir = join(projectRoot, 'food_tables')
const outputFile = join(projectRoot, 'src', 'data', 'foods.generated.json')

const xmlParser = new XMLParser({
  ignoreAttributes: false,
  parseTagValue: false,
  trimValues: false,
})

const mealKeywords = {
  breakfast: [
    'coffee',
    'tea',
    'latte',
    'cappuccino',
    'milk',
    'cereal',
    'oat',
    'oats',
    'bagel',
    'toast',
    'muffin',
    'pancake',
    'waffle',
    'yogurt',
    'fruit',
    'banana',
    'apple',
    'egg',
    'breakfast',
    'smoothie',
    'shake',
  ],
  lunch: [
    'sandwich',
    'salad',
    'wrap',
    'taco',
    'burrito',
    'quesadilla',
    'burger',
    'soup',
    'pizza',
    'pasta',
    'rice',
    'noodle',
    'sub',
    'chili',
    'meal',
  ],
  dinner: [
    'chicken',
    'beef',
    'pork',
    'steak',
    'salmon',
    'turkey',
    'fish',
    'shrimp',
    'meat',
    'roast',
    'baked',
    'fried',
    'grilled',
    'casserole',
    'lasagna',
    'dinner',
  ],
  snacks: [
    'snack',
    'bar',
    'chip',
    'cookie',
    'cracker',
    'nuts',
    'trail mix',
    'popcorn',
    'dessert',
    'ice cream',
    'sherbet',
    'sorbet',
    'jelly',
    'jam',
    'honey',
    'syrup',
    'sugar',
    'dip',
    'dressing',
    'sauce',
    'mayonnaise',
    'ketchup',
    'mustard',
    'gravy',
    'butter',
    'margarine',
    'cream cheese',
  ],
}

function cleanText(value) {
  return String(value ?? '')
    .replace(/\s+/g, ' ')
    .trim()
}

function slugify(value) {
  return cleanText(value)
    .toLowerCase()
    .replace(/['"]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function toNumber(value) {
  const parsed = Number.parseFloat(String(value ?? '').trim())
  return Number.isFinite(parsed) ? parsed : 0
}

function normalizeRows(value) {
  if (!value) {
    return []
  }

  return Array.isArray(value) ? value : [value]
}

async function readXmlTable(fileName) {
  const filePath = join(sourceDir, fileName)
  const xml = await readFile(filePath, 'utf8')
  const parsed = xmlParser.parse(xml)
  const rootName = fileName.replace(/\.xml$/i, '')
  const rowName = rootName.replace(/_Table$/i, '_Row')
  const rows = parsed?.[rootName]?.[rowName] ?? parsed?.[rootName]?.[rowName?.toString?.()] ?? []

  return normalizeRows(rows)
}

async function readTable(baseName) {
  const xmlPath = join(sourceDir, `${baseName}.xml`)

  if (existsSync(xmlPath)) {
    return readXmlTable(`${baseName}.xml`)
  }

  throw new Error(`No XML file found for ${baseName}`)
}

function deriveCategory(name, servingLabel, sourceName) {
  const lower = `${name} ${servingLabel} ${sourceName}`.toLowerCase()

  if (
    lower.includes('coffee') ||
    lower.includes('tea') ||
    lower.includes('latte') ||
    lower.includes('cappuccino') ||
    lower.includes('milk') ||
    lower.includes('juice') ||
    lower.includes('water') ||
    lower.includes('smoothie') ||
    lower.includes('shake')
  ) {
    return 'Drinks'
  }

  if (
    lower.includes('sauce') ||
    lower.includes('dressing') ||
    lower.includes('honey') ||
    lower.includes('syrup') ||
    lower.includes('jelly') ||
    lower.includes('jam') ||
    lower.includes('sugar') ||
    lower.includes('butter') ||
    lower.includes('margarine') ||
    lower.includes('cream cheese') ||
    lower.includes('dip') ||
    lower.includes('mayonnaise') ||
    lower.includes('ketchup') ||
    lower.includes('mustard') ||
    lower.includes('gravy')
  ) {
    return 'Condiments & extras'
  }

  if (
    lower.includes('oat') ||
    lower.includes('cereal') ||
    lower.includes('bagel') ||
    lower.includes('toast') ||
    lower.includes('muffin') ||
    lower.includes('pancake') ||
    lower.includes('waffle') ||
    lower.includes('yogurt') ||
    lower.includes('banana') ||
    lower.includes('fruit') ||
    lower.includes('breakfast')
  ) {
    return 'Breakfast foods'
  }

  if (
    lower.includes('sandwich') ||
    lower.includes('salad') ||
    lower.includes('wrap') ||
    lower.includes('taco') ||
    lower.includes('burrito') ||
    lower.includes('quesadilla') ||
    lower.includes('burger') ||
    lower.includes('pizza') ||
    lower.includes('pasta') ||
    lower.includes('rice') ||
    lower.includes('soup') ||
    lower.includes('chili')
  ) {
    return 'Lunch foods'
  }

  if (
    lower.includes('chicken') ||
    lower.includes('beef') ||
    lower.includes('pork') ||
    lower.includes('salmon') ||
    lower.includes('turkey') ||
    lower.includes('fish') ||
    lower.includes('shrimp') ||
    lower.includes('roast') ||
    lower.includes('fried') ||
    lower.includes('baked') ||
    lower.includes('grilled') ||
    lower.includes('steak') ||
    lower.includes('casserole') ||
    lower.includes('lasagna')
  ) {
    return 'Dinner foods'
  }

  return 'Prepared foods'
}

function deriveMealHints(name, category, servingLabel) {
  const lower = `${name} ${category} ${servingLabel}`.toLowerCase()
  const hints = new Set()

  for (const [meal, keywords] of Object.entries(mealKeywords)) {
    if (keywords.some((keyword) => lower.includes(keyword))) {
      hints.add(meal)
    }
  }

  if (hints.size === 0) {
    hints.add('breakfast')
    hints.add('lunch')
    hints.add('dinner')
    hints.add('snacks')
  }

  return Array.from(hints)
}

function buildCondimentNoteMap(rows) {
  const notes = new Map()

  for (const row of rows) {
    const code = cleanText(row.Survey_Food_Code ?? row.survey_food_code ?? row.Food_Code ?? row.food_code)
    if (!code) {
      continue
    }

    const condimentNames = Object.entries(row)
      .filter(([key, value]) => /cond_\d+_name$/i.test(key) && cleanText(value))
      .sort(([left], [right]) => {
        const leftIndex = Number.parseInt(left.match(/\d+/)?.[0] ?? '0', 10)
        const rightIndex = Number.parseInt(right.match(/\d+/)?.[0] ?? '0', 10)
        return leftIndex - rightIndex
      })
      .map(([, value]) => cleanText(value))

    if (condimentNames.length > 0) {
      notes.set(code, `Common add-ons: ${condimentNames.slice(0, 4).join(', ')}`)
    }
  }

  return notes
}

function buildFoodItemFromDisplayRow(row, condimentNotes) {
  const code = cleanText(row.Food_Code ?? row.food_code)
  const name = cleanText(row.Display_Name ?? row.display_name)
  const servingLabel = cleanText(row.Portion_Display_Name ?? row.portion_display_name) || '1 serving'
  const calories = Math.round(toNumber(row.Calories ?? row.calories))

  if (!code || !name || calories <= 0) {
    return null
  }

  const category = deriveCategory(name, servingLabel, 'Food Display')
  const note = condimentNotes.get(code)

  return {
    id: `food-${code}-${slugify(name)}-${slugify(servingLabel)}`,
    name,
    category,
    mealHints: deriveMealHints(name, category, servingLabel),
    servingLabel,
    calories,
    note,
  }
}

function buildFoodItemFromCondimentRow(row) {
  const code = cleanText(row.survey_food_code ?? row.Survey_Food_Code ?? row.food_code)
  const name = cleanText(row.display_name ?? row.Display_Name)
  const servingLabel = cleanText(row.condiment_portion_size ?? row.Condiment_Portion_Size) || '1 serving'
  const calories = Math.round(
    toNumber(row.condiment_calories ?? row.Calories ?? row.calories ?? row.condimentCalories),
  )

  if (!code || !name || calories <= 0) {
    return null
  }

  const category = 'Condiments & extras'

  return {
    id: `condiment-${code}-${slugify(name)}-${slugify(servingLabel)}`,
    name,
    category,
    mealHints: ['breakfast', 'lunch', 'dinner', 'snacks'],
    servingLabel,
    calories,
    note: `Condiment portion: ${servingLabel}`,
  }
}

async function main() {
  const [foodDisplayRows, foodsWithCondimentsRows, condimentRows] = await Promise.all([
    readTable('Food_Display_Table'),
    readTable('Foods_Needing_Condiments_Table'),
    readTable('lu_Condiment_Food_Table'),
  ])

  const condimentNotes = buildCondimentNoteMap(foodsWithCondimentsRows)

  const importedFoods = [
    ...foodDisplayRows
      .map((row) => buildFoodItemFromDisplayRow(row, condimentNotes))
      .filter(Boolean),
    ...condimentRows.map((row) => buildFoodItemFromCondimentRow(row)).filter(Boolean),
  ]

  importedFoods.sort((left, right) => {
    const categoryCompare = left.category.localeCompare(right.category)
    if (categoryCompare !== 0) {
      return categoryCompare
    }

    const nameCompare = left.name.localeCompare(right.name)
    if (nameCompare !== 0) {
      return nameCompare
    }

    return left.servingLabel.localeCompare(right.servingLabel)
  })

  const uniqueFoods = []
  const seen = new Set()

  for (const food of importedFoods) {
    const signature = `${food.name.toLowerCase()}|${food.servingLabel.toLowerCase()}|${food.calories}|${food.category.toLowerCase()}`
    if (seen.has(signature)) {
      continue
    }

    seen.add(signature)
    uniqueFoods.push(food)
  }

  await mkdir(dirname(outputFile), { recursive: true })
  await writeFile(outputFile, `${JSON.stringify(uniqueFoods, null, 2)}\n`)

  console.log(
    `Generated ${uniqueFoods.length} food items from ${foodDisplayRows.length} display rows, ${foodsWithCondimentsRows.length} condiment mappings, and ${condimentRows.length} condiment rows.`,
  )
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
