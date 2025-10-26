import "./assets/blog.css";
import "./use.js";

import { ItemFactory } from "./src/item.js";
import { BlogFactory } from "./src/blog.js";
const Item = await ItemFactory(use);
export const Blog = await BlogFactory(use, Item);


