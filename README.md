Content management system by LB Websites 2024

//2024-04-02

Project developed by LB Websites © 2024. All rights reserved.

//

Next.js / React.js / Tailwind

//

Database: MongoDB
Image & Video API: Cloudinary
CMS: LB Websites CMS

//

ka daryti next:

Based on your travel product page design and requirements, here's the complete database structure you should add to your CMS:

## **Existing Fields (keep these):**

- Document ID
- brand
- category
- colors
- description
- details
- gender
- images
- price
- sizes
- title

## **New Travel-Specific Fields to Add:**

### **Basic Travel Info:**

- `country` - string (e.g., "Lietuva", "Italija")
- `travelType` - string (e.g., "Aktyvus turizmas", "Kultūros kelionė")
- `cities` - string (e.g., "Ignalina, Palūšė, Stripeikiai")
- `duration` - string (e.g., "2 dienos", "5 dienos")
- `shortDescription` - text (for the "Pagrindinė informacija" section)

### **Pricing & Includes:**

- `includedinprice` - array of strings (for "Kainoje įskaičiuota")
- `excludedinprice` - array of strings (for "Kainoje neįskaičiuota")

### **Rating & Reviews:**

- `rating` - number (e.g., 4.8)
- `reviewCount` - number (e.g., 127)

### **Travel Days Structure:**

- `dayamount` - number (e.g., 2, 3, 5)
- `travelDays` - array of objects:
  ```javascript
  [
    {
      day: 1,
      title: '1-a diena: Atvykimas ir pažintis su parku',
      description:
        'Atvykimas į Ignaliną. Apsilankymas Aukštaitijos nacionalinio parko lankytojų centre...',
    },
    {
      day: 2,
      title: '2-a diena: Aktyvus poilsis ir išvykimas',
      description:
        'Plaukimas baidarėmis Aukštaitijos ežerais. Pietūs gamtoje...',
    },
  ];
  ```

## **CMS Implementation Logic:**

1. **When user selects `dayamount`** (e.g., 3):

   - Show 3 input field pairs:
     - Day 1: Title input + Description textarea
     - Day 2: Title input + Description textarea
     - Day 3: Title input + Description textarea

2. **For arrays** (`includedinprice`, `excludedinprice`):

   - Allow adding/removing items dynamically
   - Each item is a string

3. **Reuse existing fields:**
   - `images` - for the image gallery
   - `title` - for the main travel title
   - `description` - for the detailed description in tabs
   - `price` - for the main price display

This structure will perfectly match your current page design and allow for easy expansion when you add the day editing functionality later.

- straipsniai images upload with cloudinary and firebase for saving url same as with other things
