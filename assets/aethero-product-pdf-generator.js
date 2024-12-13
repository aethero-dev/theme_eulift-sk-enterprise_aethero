document.addEventListener('DOMContentLoaded', function() {
    const productForm = document.querySelector('product-form');
    if (!productForm) return;
  
    console.log('Product form nalezen'); // Debug
  
    // Zkusíme různé selektory pro radio buttony
    const radioInputs = document.querySelectorAll('input[type="radio"][name*="option"]');
    console.log('Nalezeno radio inputs (všechny):', radioInputs.length); // Debug
  
    radioInputs.forEach(input => {
      input.addEventListener('change', function(event) {
        console.log('Změna radio buttonu detekována pro hodnotu:', input.value); // Debug
        
        // Přidáme malé zpoždění pro zajištění aktualizace ceny v DOM
        setTimeout(() => {
          const button = document.querySelector('.download-offer-btn');
          const priceElement = document.querySelector('.price__current');
          
          if (button && priceElement) {
            const originalPrice = priceElement.textContent.trim();
            const priceText = originalPrice
              .replace(/\s+/g, '')
              .replace(/[^0-9,]/g, '');
            
           // console.log('Původní cena:', originalPrice);
            //console.log('Zpracovaná cena:', priceText);
            
            button.dataset.productPrice = priceText;
          }
        }, 100); // Zpoždění 100ms
      });
    });
  
    // Sledování změn ceny v DOM
    const priceObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'characterData' || mutation.type === 'childList') {
          //console.log('Detekována změna ceny v DOM');
          const priceElement = document.querySelector('.price__current');
          if (priceElement) {
            //console.log('Nová cena v DOM:', priceElement.textContent.trim());
          }
        }
      });
    });
  
    const priceElement = document.querySelector('.price__current');
    if (priceElement) {
      priceObserver.observe(priceElement, {
        characterData: true,
        childList: true,
        subtree: true
      });
    }
  
    // Přidání sledování změn pro dropdown select
    const customSelects = document.querySelectorAll('custom-select');
    customSelects.forEach(select => {
      const selectButton = select.querySelector('.custom-select__btn');
      if (selectButton) {
        // Sledování změn v MutationObserver pro text v buttonu
        const selectObserver = new MutationObserver((mutations) => {
          mutations.forEach((mutation) => {
            if (mutation.type === 'characterData' || mutation.type === 'childList') {
              console.log('Změna varianty v dropdownu detekována');
              
              // Přidáme malé zpoždění pro zajištění aktualizace ceny v DOM
              setTimeout(() => {
                const button = document.querySelector('.download-offer-btn');
                const priceElement = document.querySelector('.price__current');
                
                if (button && priceElement) {
                  const originalPrice = priceElement.textContent.trim();
                  const priceText = originalPrice
                    .replace(/\s+/g, '')
                    .replace(/[^0-9,]/g, '');
                  
                  console.log('Původní cena:', originalPrice);
                  console.log('Zpracovaná cena:', priceText);
                  
                  button.dataset.productPrice = priceText;
                }
              }, 100);
            }
          });
        });
  
        // Sledování změn v textu tlačítka
        const spanElement = selectButton.querySelector('span');
        if (spanElement) {
          selectObserver.observe(spanElement, {
            characterData: true,
            childList: true,
            subtree: true
          });
        }
      }
    });
  });
  
  pdfMake.fonts = {
    Roboto: {
      normal: 'https://cdn.jsdelivr.net/npm/@fontsource/roboto@4.5.8/files/roboto-latin-ext-400-normal.woff',
      bold: 'https://cdn.jsdelivr.net/npm/@fontsource/roboto@4.5.8/files/roboto-latin-ext-700-normal.woff',
      italics: 'https://cdn.jsdelivr.net/npm/@fontsource/roboto@4.5.8/files/roboto-latin-ext-400-italic.woff',
      bolditalics: 'https://cdn.jsdelivr.net/npm/@fontsource/roboto@4.5.8/files/roboto-latin-ext-700-italic.woff'
    }
  };
  
  async function generateAndDownloadPDF() {
    const button = document.querySelector('.download-offer-btn');
  
    // Funkce pro načtení obrázku a konverzi do base64
    const loadImage = async (url) => {
      try {
        const response = await fetch(url);
        const blob = await response.blob();
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        });
      } catch (error) {
        console.error('Chyba při načítání obrázku:', error);
        return null;
      }
    };
  
    try {
      // Načtení obrázků
      const logoBase64 = await loadImage('https://cdn.shopify.com/s/files/1/0834/5468/9568/files/heli_eulift_logo.png?v=1731406180');
      const homeIconBase64 = await loadImage('https://cdn.shopify.com/s/files/1/0834/5468/9568/files/wholesale.png?v=1731408290');
      const productImageBase64 = button.dataset.productImage ? await loadImage(button.dataset.productImage) : null;
  
      // Definice stylu dokumentu
      const docDefinition = {
        pageSize: 'A4',
        pageMargins: [40, 40, 40, 80],
        defaultStyle: {
          font: 'Roboto'
        },
        content: [
          {
            columns: [
              {
                image: logoBase64,
                width: 250,
                margin: [0, 0, 0, 20]
              },
              {
                image: homeIconBase64,
                width: 30,
                margin: [235, 30, 0, 0]
              }
            ]
          },
          {
            columns: [
              {
                width: '50%',
                text: [
                  { text: 'Odberateľ:\n\n\n\n\n\n\n\n\n', style: 'label' },
                  { text: 'IČO:\n', style: 'label' },
                  { text: 'DIČ:\n', style: 'label' },
                  { text: 'Telefon:\n', style: 'label' },
                  { text: 'E-mail:\n', style: 'label' }
                ]
              },
              {
                width: '50%',
                alignment: 'right',
                text: [
                  { text: 'Dodávateľ:\n', style: 'label' },
                  { text: 'Gekkon International s.r.o.\n', style: 'bold' },
                  'Milheimova 2915\n',
                  '530 02 Pardubice\n',
                  'Česká republika\n',
                  { text: 'IČO: 25930681 / DIČ: CZ25930681\n', style: 'bold' },
                  { text: 'Gekkon International s.r.o. vedené u Krajského soudu v Hradci\n', style: 'small' },
                  { text: 'Králové pod spisovou značkou: oddíl C vložka 15441\n\n\n', style: 'small' },
                  'obchod@eulift.cz\n',
                  'www.gekkon.org | www.heli.cz | www.eulift.cz | www.helipowersystem.cz'
                ]
              }
            ],
            margin: [0, 0, 0, 20]
          },
          {
            table: {
              widths: ['60%', '40%'],
              body: [
                [
                  [
                    { text: 'PONUKA TOVARU', style: 'tableHeader' },
                    { text: button.dataset.productTitle, margin: [0, 5, 0, 0] },
                    { 
                      text: (() => {
                        // Kontrola radio buttonů
                        const selectedRadio = document.querySelector('input[type="radio"][name*="option"]:checked');
                        const selectedDropdown = document.querySelector('.custom-select__btn span');
                        
                        let variantText = '';
                        
                        if (selectedRadio) {
                          variantText += 'Vyberaná varianta tovaru: ' + selectedRadio.value;
                        }
                        
                        if (selectedDropdown) {
                          if (variantText) variantText += '\n';
                          variantText += 'Výška zdvihu: ' + selectedDropdown.textContent.trim();
                        }
                        
                        return variantText;
                      })(),
                      margin: [0, 5, 0, 0],
                      fontSize: 10,
                      italics: true
                    }
                  ],
                  [
                    { text: 'Cena bez DPH:', style: 'label', margin: [0, 0, 0, 5] },
                    { 
                      text: button.dataset.productPrice === '0' || button.dataset.productPrice === '0,00' ? 
                            'Cena na dopyt' : 
                            '€' + button.dataset.productPrice.replace(/\B(?=(\d{3})+(?!\d))/g, ' '),
                      style: 'bold' 
                    },
                    { text: '\nDátum vyhotovenia:', style: 'label' },
                    { text: new Date().toLocaleDateString('cs-CZ') }
                  ]
                ]
              ]
            },
            margin: [0, 0, 0, 20]
          }
        ],
        styles: {
          tableHeader: {
            fontSize: 14,
            bold: true,
            margin: [0, 0, 0, 0]
          },
          label: {
            fontSize: 10,
            bold: true,
            margin: [0, 3, 0, 3]
          },
          bold: {
            bold: true
          },
          small: {
            fontSize: 8
          },
          productDescription: {
            fontSize: 14,
            margin: [0, 0, 0, 0]
          }
        }
      };
  
      // Přidání obrázku produktu a krátkého popisu
      if (productImageBase64) {
        docDefinition.content.push({
          stack: [
            {
              image: productImageBase64,
              width: 300,
              alignment: 'center',
              margin: [50, 0, 0, 20]
            }, 
          ]
        });
      }
  
      // Přidání krátkého popisu se zmenšeným písmem
      if (button.dataset.kratkyPopis) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(button.dataset.kratkyPopis, 'text/html');
        
        const formatText = (node) => {
          let textParts = [];
          
          const processNode = (currentNode) => {
            if (currentNode.nodeType === Node.TEXT_NODE) {
              if (currentNode.textContent.trim()) {
                textParts.push({ 
                  text: currentNode.textContent,
                  bold: false
                });
              }
            } else if (currentNode.nodeType === Node.ELEMENT_NODE) {
              // Zpracování odstavců
              if (currentNode.tagName === 'P') {
                for (let child of currentNode.childNodes) {
                  processNode(child);
                }
                textParts.push({ text: '\n\n', bold: false });
              }
              // Zpracování SPAN elementů
              else if (currentNode.tagName === 'SPAN') {
                for (let child of currentNode.childNodes) {
                  processNode(child);
                }
              }
              // Zpracování B a STRONG tagů
              else if (currentNode.tagName === 'B' || currentNode.tagName === 'STRONG') {
                textParts.push({
                  text: currentNode.textContent,
                  bold: true
                });
              }
              // Zpracování odkazů
              else if (currentNode.tagName === 'A') {
                textParts.push({
                  text: currentNode.textContent,
                  bold: false,
                  color: 'blue',
                  decoration: 'underline'
                });
              }
              // Rekurzivní zpracování ostatních elementů
              else {
                for (let child of currentNode.childNodes) {
                  processNode(child);
                }
              }
            }
          };
  
          // Zpracování všech child nodes
          for (let child of node.childNodes) {
            processNode(child);
          }
  
          return textParts;
        };
  
        const formattedText = formatText(doc.body);
        console.log('Formatted text parts:', formattedText); // Pro kontrolu výsledku
  
        docDefinition.content.push({
          stack: [
            {
              text: 'Podrobný popis produktu:',
              style: 'tableHeader',
              margin: [0, 0, 0, 5]
            },
            {
              text: formattedText,
              style: 'productDescription',
              margin: [0, 0, 0, 0],
              fontSize: 11,
              lineHeight: 1.2
            }
          ],
          pageBreak: 'before'
        });
      }
  
      // Rozšířený seznam technických parametrů
      const parameters = [
        ['Nosnosť', button.dataset.nosnost],
        ['Konštrukčná výška', button.dataset.konstrukcniVyska],
        ['Výška zdvihu', button.dataset.vyskaZdvihu],
        ['Dĺžka vidlíc', button.dataset.delkaVidlic],
        ['Šírka vidlice', button.dataset.sirkaVidlice],
        ['Rozteč vidlíc vnútorná', button.dataset.roztecVidlicVnitrni],
        ['Rozteč vidlíc vonkajšia', button.dataset.roztecVidlicVnejsi],
        ['Celková dĺžka', button.dataset.celkovaDelka],
        ['Celková šírka', button.dataset.celkovaSirka],
        ['Celková výška', button.dataset.celkovaVyska],
        ['Pohon', button.dataset.pohon],
        ['Hmotnosť', button.dataset.hmotnost],
        ['Vnútorný rozmer', button.dataset.vnitrniRozmer],
        ['Príslušenstvo', button.dataset.prislusenstvi],
        ['Priemer vidlicového kolesa', button.dataset.prumerVidlicovehoKola],
        ['Priemer hnacieho kolesa', button.dataset.prumerHnacihoKola],
        ['Minimálna výška zdvihu', button.dataset.minimalniVyskaZdvihu],
        ['Dĺžka reťaze', button.dataset.delkaRetezu],
        ['Osvetlenie', button.dataset.osvetleni],
        ['Ložná plocha', button.dataset.loznaPlocha],
        ['Ťažná kapacita', button.dataset.taznaKapacita],
        ['Výška madla', button.dataset.vyskaMadla],
        ['Rozmery stola', button.dataset.rozmeryStolu],
        ['Polomer otáčania', button.dataset.polomerOtaceni],
        ['Ovládanie zdvihu', button.dataset.ovladaniZdvihu],
        ['Vidlicové kolesá', button.dataset.vidlicovaKola],
        ['Materiál kolesa', button.dataset.materialKola],
        ['Krokový zdvih', button.dataset.krokovyZdvih],
        ['Motor pojazdu', button.dataset.motorPojezdu],
        ['Motor zdvihu', button.dataset.motorZdvihu],
        ['Napájanie', button.dataset.napajeni],
        ['Kapacita batérie', button.dataset.kapacitaBaterie],
        ['Vyloženie ťažiska', button.dataset.vylozeniTeziste],
        ['Maximálna výška vozíka', button.dataset.maximalniVyskaVoziku]
      ].filter(([_, value]) => value);
  
      if (parameters.length > 0) {
        // Nadpis a první parametr jako unbreakable skupina
        docDefinition.content.push(
          {
            stack: [
              { 
                text: 'Technické parametre:', 
                style: 'tableHeader', 
                margin: [0, 30, 0, 10]
              },
              {
                table: {
                  widths: ['40%', '60%'],
                  headerRows: 0,
                  body: [parameters[0]].map(param => [{
                    text: param[0],
                    bold: true,
                    fillColor: '#f8f8f8',
                    border: [false, false, false, false],
                    margin: [0, 8, 0, 8]
                  }, {
                    text: param[1],
                    fillColor: '#f8f8f8',
                    border: [false, false, false, false],
                    margin: [0, 8, 0, 8]
                  }])
                },
                layout: {
                  hLineWidth: function() { return 0; },
                  vLineWidth: function() { return 0; },
                  paddingLeft: function() { return 5; },
                  paddingRight: function() { return 5; },
                  paddingTop: function() { return 3; },
                  paddingBottom: function() { return 3; }
                }
              }
            ],
            unbreakable: true
          }
        );
  
        // Zbytek parametrů
        if (parameters.length > 1) {
          docDefinition.content.push({
            table: {
              widths: ['40%', '60%'],
              headerRows: 0,
              body: parameters.slice(1).map((param, i) => [{
                text: param[0],
                bold: true,
                fillColor: (i + 1) % 2 === 0 ? '#f8f8f8' : null,
                border: [false, false, false, false],
                margin: [0, 8, 0, 8]
              }, {
                text: param[1],
                fillColor: (i + 1) % 2 === 0 ? '#f8f8f8' : null,
                border: [false, false, false, false],
                margin: [0, 8, 0, 8]
              }])
            },
            layout: {
              hLineWidth: function() { return 0; },
              vLineWidth: function() { return 0; },
              paddingLeft: function() { return 5; },
              paddingRight: function() { return 5; },
              paddingTop: function() { return 3; },
              paddingBottom: function() { return 3; }
            }
          });
        }
      }
  
      // Upravená patička
      docDefinition.footer = {
        stack: [
          {
            canvas: [
              {
                type: 'line',
                x1: 40,
                y1: 0,
                x2: 555,
                y2: 0,
                lineWidth: 1
              }
            ]
          },
          {
            columns: [
              {
                width: '30%',
                text: 'Vygenerované z www.eulift.cz\n' + button.dataset.productTitle,
                style: 'small',
                margin: [40, 5, 0, 0]
              },
              {
                width: '40%',
                text: 'Gekkon International s.r.o.\nMilheimova 2915\n530 02 Pardubice\nIČO: 25930681 / DIČ: CZ25930681',
                style: 'small',
                margin: [100, 5, 0, 0]
              },
              {
                width: '30%',
                image: logoBase64,
                width: 120,
                margin: [0, 5, 40, 0]
              }
            ]
          }
        ]
      };
  
    
  
      // Generovní PDF
      pdfMake.createPdf(docDefinition).download(`ponuka-${button.dataset.productTitle.toLowerCase().replace(/\s+/g, '-')}.pdf`);
  
    } catch (error) {
      console.error('Chyba při generování PDF:', error);
      alert('Nastala chyba pri generovaní PDF. Prosím, skúste to znova neskôr.');
    }
  }
  
  