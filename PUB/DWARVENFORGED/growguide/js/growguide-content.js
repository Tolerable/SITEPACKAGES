// Content data for Dwarven Forged Grow Guide
// This separates the content from the layout for easier editing

const contentData = {
    // Introduction Section
    "intro": `
        <div class="content-header">
            <img src="https://www.sitepackages.net/PUB/DWARVENFORGED/img/growing-guide.jpg" alt="Dwarven Forged Grow Guide" class="hero-image">
            <h1>DWARVEN FORGED MASTER GROW GUIDE</h1>
            <div class="subtitle">DIGITAL EDITION</div>
        </div>
        
        <div class="intro-text">
            <p>Welcome to the official Dwarven Forged Grow Guide. Like the mythical dwarven smiths who crafted legendary treasures in their mountain forges, we'll help you forge exceptional plants with precision and care. This comprehensive guide will walk you through every stage of the cultivation process - from setting up your grow space to harvesting and enjoying your meticulously crafted herbs.</p>
            <p>Crafted by a collective of passionate cannabis artisans with decades of combined experience, this guide contains the accumulated wisdom of master growers who have perfected their craft through years of careful selection and testing.</p>
        </div>
        
        <p>Select any chapter from the navigation menu to begin your journey into cultivation mastery. Each section provides detailed information and dwarven wisdom to help you become a master grower.</p>
    `,

    // Step 1 Section
    "step1": `
        <h1>Step 1: Choosing Your Forge (Grow Space)</h1>
        
        <p>Just as dwarven smiths carefully selected the perfect cavern for their forge, choosing the right grow space is crucial for cultivating premium herbs. Your grow space is the foundation upon which your entire operation will be built, so take the time to consider your options carefully.</p>
        
        <h3>Space Requirements</h3>
        <p>When selecting your forge, consider the amount of space you have available. You'll need enough room for your plants and all necessary equipment, including grow lights, fans, and ventilation systems. Remember that plants need space to grow both vertically and horizontally, so plan accordingly.</p>
        
        <h3>Location Factors</h3>
        <p>The ideal forge location should be private and easily controlled in terms of temperature, light, and humidity. Basements, spare rooms, and dedicated grow areas work well as they provide good insulation from external environments and can be secured from unwanted attention.</p>
        
        <h3>Preparation</h3>
        <p>Before setting up, thoroughly clean and disinfect the area to remove any potential contaminants like mold or pests. Proper preparation creates a pristine environment for your precious seedlings to thrive.</p>
        
        <div class="tip-box">
            <h4>Dwarven Wisdom:</h4>
            <p>For novice crafters, pre-made grow tents offer an excellent starting point. These portable forges come in various sizes and include essential components like ventilation systems, grow lights, and reflective walls to maximize light distribution. They can be easily assembled in any room with access to electricity and provide a controlled environment for forging your botanical treasures.</p>
        </div>
        
        <div class="nav-buttons">
            <button class="nav-button" onclick="showSection('intro')">Back to Intro</button>
            <button class="nav-button" onclick="showSection('step2')">Next: Setting Up Your Forge</button>
        </div>
    `,

    // Step 2 Section
    "step2": `
        <h1>Step 2: Setting Up Your Forge</h1>
        
        <p>Now that you've chosen your forge location, it's time to equip it with the tools and systems needed to create the perfect growing environment. Like a dwarven smith arranging their anvils, hammers, and fire pits, you'll need to set up your grow space with precision and care.</p>
        
        <h3>Illumination: The Forge Fire</h3>
        <p>The most critical component of your forge is the lighting system. Several options are available:</p>
        <ul>
            <li><strong>High-Pressure Sodium (HPS) & Metal Halide (MH):</strong> Traditional forge fires that are affordable but emit significant heat</li>
            <li><strong>Light-Emitting Diode (LED):</strong> Modern dwarven technology that produces less heat, uses less energy, but requires a higher initial investment</li>
        </ul>
        
        <h3>Ventilation: The Forge Bellows</h3>
        <p>Proper airflow is essential for temperature control, humidity management, and bringing fresh CO2 to your plants. Position fans to create a gentle breeze throughout your grow space, preventing mold and strengthening plant stems. Consider adding carbon filters to eliminate odors - an important consideration for discreet crafting.</p>
        
        <div class="tip-box">
            <h4>Dwarven Wisdom:</h4>
            <p>Modern forges can be equipped with automated systems to control lighting schedules, temperature, and humidity. While convenient, always have backup manual systems in place. As master smiths know, relying solely on enchanted tools can lead to disaster if the magic fails!</p>
        </div>
        
        <h3>Monitoring Systems</h3>
        <p>Install thermometers and hygrometers to track temperature and humidity levels. Regular monitoring allows you to make necessary adjustments to maintain optimal growing conditions. The mark of a master craftsman is attention to detail - check your forge daily!</p>
        
        <div class="nav-buttons">
            <button class="nav-button" onclick="showSection('step1')">Previous: Choosing Your Forge</button>
            <button class="nav-button" onclick="showSection('step3')">Next: Selecting Your Ore</button>
        </div>
    `,

    // Step 3 Section
    "step3": `
        <h1>Step 3: Selecting Your Ore (Growing Medium)</h1>
        
        <p>Just as dwarven smiths carefully select the finest ores for their metalwork, choosing the right growing medium is crucial for cultivating exceptional plants. Each medium has its own properties that affect water retention, nutrient availability, and root development.</p>
        
        <h3>Soil: The Traditional Ore</h3>
        <p>Soil is the most common and beginner-friendly medium. A high-quality soil mix with good drainage and nutrient content provides an excellent foundation for your plants. Master crafters often enhance basic soil with organic components like worm castings, composted bark, and peat moss to forge a superior growing environment.</p>
        
        <p>For improved drainage and aeration, consider adding materials like perlite or vermiculite to keep the soil light and airy. The benefit of soil is its excellent natural nutrient content and forgiveness for novice growers.</p>
        
        <h3>Hydroponics: The Alchemical Approach</h3>
        <p>For advanced crafters, hydroponics offers a soilless method where plants grow directly in a nutrient-rich water solution. This technique results in faster growth and higher yields as plants can access nutrients more efficiently. However, hydroponic systems require more monitoring and technical knowledge to maintain properly.</p>
        
        <h3>Coco Coir: The Balanced Alloy</h3>
        <p>Made from coconut husks, coco coir provides excellent water retention while maintaining good aeration. It delivers the best qualities of both soil and hydroponics, making it popular among intermediate growers. Coco coir promotes healthy root development and can be enhanced with various nutrients for optimal growth.</p>
        
        <div class="tip-box">
            <h4>Dwarven Wisdom:</h4>
            <p>When selecting your growing medium, consider your experience level, available time for maintenance, and growing style. Like a master smith who chooses different metals for different projects, you may find that different growing mediums work better for different strains or growing conditions.</p>
        </div>
        
        <div class="nav-buttons">
            <button class="nav-button" onclick="showSection('step2')">Previous: Setting Up Your Forge</button>
            <button class="nav-button" onclick="showSection('step4')">Next: Choosing Your Materials</button>
        </div>
    `,

    // Step 4 Section
    "step4": `
        <h1>Step 4: Choosing Your Materials (Strains)</h1>
        
        <p>Just as dwarven smiths select specific metals for their legendary weapons and artifacts, choosing the right cannabis strain is crucial to your cultivation success. Each strain has unique characteristics, growing requirements, and effects that will determine your final product.</p>
        
        <h3>Seeds vs. Clones</h3>
        <p>You can begin your journey with either seeds or clones:</p>
        <ul>
            <li><strong>Seeds:</strong> Offer genetic diversity and resilience, but with some variability in growth patterns</li>
            <li><strong>Clones:</strong> Cuttings from mature plants that maintain identical genetics to their parent, ensuring consistency but sometimes with less vigor</li>
        </ul>
        
        <h3>Strain Selection Factors</h3>
        <p>When selecting your strain, consider:</p>
        <ul>
            <li><strong>Growing Environment:</strong> Some strains thrive indoors, others outdoors</li>
            <li><strong>Growing Space:</strong> Certain strains grow tall and lanky, others short and bushy</li>
            <li><strong>Experience Level:</strong> Novice crafters should begin with more forgiving, resilient strains</li>
            <li><strong>Flowering Time:</strong> Ranges from 7-12+ weeks depending on genetics</li>
            <li><strong>Desired Effects:</strong> Different strains produce varying effects and potency</li>
        </ul>
        
        <div class="tip-box">
            <h4>Dwarven Wisdom:</h4>
            <p>For your first forge, select feminized seeds from reputable breeders like Dwarven Forged to ensure you're working with quality genetics. Beginner-friendly strains like our "Dwarf Hammer" provide resilience and forgiveness while still delivering exceptional results. Remember, even master smiths began with simpler projects before forging legendary artifacts!</p>
        </div>
        
        <div class="nav-buttons">
            <button class="nav-button" onclick="showSection('step3')">Previous: Selecting Your Ore</button>
            <button class="nav-button" onclick="showSection('step5')">Next: Awakening the Seed</button>
        </div>
    `,

    // Step 5 Section
    "step5": `
        <h1>Step 5: Awakening the Seed (Germination)</h1>
        
        <p>Like a dwarven smith breathing life into raw metal through the initial heating, germination awakens the dormant potential within each seed. This crucial first step sets the foundation for the entire growing process.</p>
        
        <h3>The Paper Towel Method</h3>
        <p>One of the most reliable techniques for novice growers is the paper towel method:</p>
        <ol>
            <li>Place seeds between two damp paper towels</li>
            <li>Position them in a warm, dark place (70-80°F is ideal)</li>
            <li>Check every 12 hours to ensure the paper towels remain damp</li>
            <li>Wait 2-7 days for the seeds to sprout, showing small white taproots</li>
        </ol>
        
        <h3>Direct Soil Planting</h3>
        <p>Another approach is planting directly in your growing medium:</p>
        <ol>
            <li>Pre-moisten your soil or growing medium</li>
            <li>Create a small hole about half an inch deep</li>
            <li>Place the seed in the hole and gently cover</li>
            <li>Keep the area warm and moist until sprouting occurs</li>
        </ol>
        
        <h3>Dealing with Stubborn Seeds</h3>
        <p>Some seeds, like particularly dense ore, require additional techniques to awaken:</p>
        <ul>
            <li>Scarification: Carefully scoring the seed husk with a hobby knife</li>
            <li>Pre-soaking: Placing seeds in distilled water for 24 hours before germination</li>
            <li>Germination enhancers: Special hormones that stimulate sprouting</li>
        </ul>
        
        <div class="tip-box">
            <h4>Dwarven Wisdom:</h4>
            <p>Not all seeds will germinate, even with perfect technique. Plant 20-30% more seeds than you need to account for natural losses. Handle germinated seeds with extreme care - like a newly forged blade, they are at their most fragile during this early stage. Use tweezers to transfer sprouted seeds, and always handle them by the seed casing, never the delicate taproot.</p>
        </div>
        
        <div class="nav-buttons">
            <button class="nav-button" onclick="showSection('step4')">Previous: Choosing Your Materials</button>
            <button class="nav-button" onclick="showSection('step6')">Next: The First Shaping</button>
        </div>
    `,

    // Step 6 Section
    "step6": `
        <h1>Step 6: The First Shaping (Transplanting)</h1>
        
        <p>After your seeds have successfully germinated, it's time for the first shaping - transplanting your seedlings into their growing containers. Like a dwarven smith moving hot metal from the initial fire to the anvil for shaping, this transfer requires precision and care.</p>
        
        <h3>Selecting Containers</h3>
        <p>Choose containers that provide excellent drainage and appropriate space for root development:</p>
        <ul>
            <li><strong>Fabric Pots:</strong> Allow air pruning of roots, preventing them from becoming root-bound</li>
            <li><strong>Traditional Plastic Pots:</strong> Affordable and effective when drainage holes are adequate</li>
            <li><strong>Terracotta:</strong> Excellent breathability but requires more frequent watering</li>
        </ul>
        <p>Container size should match your plant's growth stage - typically starting in smaller pots (1-2 gallons) before transferring to larger final containers (3-7+ gallons) as they mature.</p>
        
        <h3>The Transplanting Process</h3>
        <ol>
            <li>Prepare your new container by filling with pre-moistened growing medium</li>
            <li>Create a hole in the center large enough for your seedling and its root system</li>
            <li>Carefully remove the seedling from its germination medium, supporting it by the stem or seed leaves</li>
            <li>Place the seedling in the hole, ensuring the stem is at the same depth as before</li>
            <li>Gently cover the roots with growing medium and lightly press down</li>
            <li>Water lightly around the base of the plant</li>
        </ol>
        
        <h3>Post-Transplant Care</h3>
        <p>After transplanting, your seedlings will need special attention:</p>
        <ul>
            <li>Maintain higher humidity (60-70%) for the first few days</li>
            <li>Provide gentle, indirect light rather than intense direct light</li>
            <li>Avoid overwatering - moist but not soaked soil is ideal</li>
            <li>Minimize stress by maintaining stable environmental conditions</li>
        </ul>
        
        <div class="tip-box">
            <h4>Dwarven Wisdom:</h4>
            <p>Transplant shock is common but can be minimized. Like a newly forged blade that must be tempered gradually, introduce your transplanted seedlings to their new environment slowly. Consider using a diluted seaweed extract solution for watering after transplant - the natural growth hormones help stimulate root development and reduce stress.</p>
        </div>
        
        <div class="nav-buttons">
            <button class="nav-button" onclick="showSection('step5')">Previous: Awakening the Seed</button>
            <button class="nav-button" onclick="showSection('step7')">Next: Tempering the Steel</button>
        </div>
    `,

    // Step 7 Section
    "step7": `
        <h1>Step 7: Tempering the Steel (Vegetative Growth)</h1>
        
        <p>The vegetative growth phase is where your plants develop their structure and strength, much like the tempering process that gives dwarven steel its legendary resilience. During this crucial period, your plants will develop the stems, branches, and leaves that will ultimately support bountiful harvests.</p>
        
        <h3>Lighting Requirements</h3>
        <p>During the vegetative phase, plants require 18-24 hours of light daily. This extended light period prevents flowering and encourages robust structural growth. Position your lights at the proper distance - too close causes light burn, too far results in stretching and weak stems.</p>
        
        <h3>Environmental Controls</h3>
        <ul>
            <li><strong>Temperature:</strong> Maintain 70-85°F during light periods, 10°F cooler during dark periods</li>
            <li><strong>Humidity:</strong> 40-60% relative humidity is ideal for vegetative growth</li>
            <li><strong>Airflow:</strong> Constant gentle breeze strengthens stems and prevents mold</li>
        </ul>
        
        <h3>Nutritional Requirements</h3>
        <p>During vegetative growth, plants require higher levels of nitrogen (N) compared to phosphorus (P) and potassium (K). Use balanced nutrients specifically formulated for the vegetative stage. Consider both:</p>
        <ul>
            <li><strong>Organic Nutrients:</strong> Derived from natural sources, slower release but more forgiving</li>
            <li><strong>Synthetic Nutrients:</strong> More concentrated and immediately available but easier to over-apply</li>
        </ul>
        
        <h3>Growth Enhancement</h3>
        <p>To maximize potential during this phase:</p>
        <ul>
            <li><strong>Beneficial Microbes:</strong> Add mycorrhizae and beneficial bacteria to enhance root development</li>
            <li
