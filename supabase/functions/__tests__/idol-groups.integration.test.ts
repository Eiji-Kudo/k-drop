import { PostgresJsDatabase } from 'drizzle-orm/postgres-js'
import { eq } from 'drizzle-orm'
import { setupTestDatabase, teardownTestDatabase, schema } from './setup'

describe('Idol Groups Integration Tests', () => {
  let db: PostgresJsDatabase<typeof schema>

  beforeAll(async () => {
    db = await setupTestDatabase()
  }, 60000)

  afterAll(async () => {
    await teardownTestDatabase()
  })

  beforeEach(async () => {
    await db.delete(schema.idolGroups)
    await db.delete(schema.groupCategories)
  })

  describe('groupCategories', () => {
    it('should insert and retrieve a group category', async () => {
      const [inserted] = await db
        .insert(schema.groupCategories)
        .values({ categoryName: 'K-POP' })
        .returning()

      expect(inserted.categoryName).toBe('K-POP')
      expect(inserted.groupCategoryId).toBeDefined()

      const categories = await db.select().from(schema.groupCategories)
      expect(categories).toHaveLength(1)
      expect(categories[0].categoryName).toBe('K-POP')
    })
  })

  describe('idolGroups', () => {
    it('should insert and retrieve an idol group with category', async () => {
      const [category] = await db
        .insert(schema.groupCategories)
        .values({ categoryName: 'K-POP' })
        .returning()

      const [idolGroup] = await db
        .insert(schema.idolGroups)
        .values({
          groupCategoryId: category.groupCategoryId,
          idolGroupName: 'BTS',
          thumbnailImage: 'https://example.com/bts.jpg',
        })
        .returning()

      expect(idolGroup.idolGroupName).toBe('BTS')
      expect(idolGroup.groupCategoryId).toBe(category.groupCategoryId)
      expect(idolGroup.thumbnailImage).toBe('https://example.com/bts.jpg')
    })

    it('should retrieve idol groups ordered by name', async () => {
      const [category] = await db
        .insert(schema.groupCategories)
        .values({ categoryName: 'K-POP' })
        .returning()

      await db.insert(schema.idolGroups).values([
        { groupCategoryId: category.groupCategoryId, idolGroupName: 'TWICE' },
        { groupCategoryId: category.groupCategoryId, idolGroupName: 'BTS' },
        {
          groupCategoryId: category.groupCategoryId,
          idolGroupName: 'BLACKPINK',
        },
      ])

      const groups = await db
        .select()
        .from(schema.idolGroups)
        .orderBy(schema.idolGroups.idolGroupName)

      expect(groups).toHaveLength(3)
      expect(groups[0].idolGroupName).toBe('BLACKPINK')
      expect(groups[1].idolGroupName).toBe('BTS')
      expect(groups[2].idolGroupName).toBe('TWICE')
    })

    it('should filter idol groups by category', async () => {
      const [kpop] = await db
        .insert(schema.groupCategories)
        .values({ categoryName: 'K-POP' })
        .returning()

      const [jpop] = await db
        .insert(schema.groupCategories)
        .values({ categoryName: 'J-POP' })
        .returning()

      await db.insert(schema.idolGroups).values([
        { groupCategoryId: kpop.groupCategoryId, idolGroupName: 'BTS' },
        { groupCategoryId: kpop.groupCategoryId, idolGroupName: 'TWICE' },
        { groupCategoryId: jpop.groupCategoryId, idolGroupName: 'AKB48' },
      ])

      const kpopGroups = await db
        .select()
        .from(schema.idolGroups)
        .where(eq(schema.idolGroups.groupCategoryId, kpop.groupCategoryId))

      expect(kpopGroups).toHaveLength(2)
      expect(kpopGroups.map((g) => g.idolGroupName)).toContain('BTS')
      expect(kpopGroups.map((g) => g.idolGroupName)).toContain('TWICE')
    })

    it('should update an idol group', async () => {
      const [category] = await db
        .insert(schema.groupCategories)
        .values({ categoryName: 'K-POP' })
        .returning()

      const [idolGroup] = await db
        .insert(schema.idolGroups)
        .values({
          groupCategoryId: category.groupCategoryId,
          idolGroupName: 'BTS',
        })
        .returning()

      await db
        .update(schema.idolGroups)
        .set({ thumbnailImage: 'https://example.com/bts-new.jpg' })
        .where(eq(schema.idolGroups.idolGroupId, idolGroup.idolGroupId))

      const [updated] = await db
        .select()
        .from(schema.idolGroups)
        .where(eq(schema.idolGroups.idolGroupId, idolGroup.idolGroupId))

      expect(updated.thumbnailImage).toBe('https://example.com/bts-new.jpg')
    })

    it('should delete an idol group', async () => {
      const [category] = await db
        .insert(schema.groupCategories)
        .values({ categoryName: 'K-POP' })
        .returning()

      const [idolGroup] = await db
        .insert(schema.idolGroups)
        .values({
          groupCategoryId: category.groupCategoryId,
          idolGroupName: 'BTS',
        })
        .returning()

      await db
        .delete(schema.idolGroups)
        .where(eq(schema.idolGroups.idolGroupId, idolGroup.idolGroupId))

      const groups = await db.select().from(schema.idolGroups)
      expect(groups).toHaveLength(0)
    })
  })
})
