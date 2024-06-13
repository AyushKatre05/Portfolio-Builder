const { pgTable,serial,varchar,text } = require("drizzle-orm/pg-core");

export const userInfo = pgTable('userInfo',{
    id : serial('id').primaryKey(),
    name:varchar('name').notNull(),
    email : varchar('email').notNull(),
    username:varchar('username'),
    bio:text('bio'),
    location:varchar('location'),
    link:varchar('link'),
    profileImage:varchar('profileImage')
})