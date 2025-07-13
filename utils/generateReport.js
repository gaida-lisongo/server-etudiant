const PdfPrinter = require("pdfmake");
require('dotenv').config();
//Recupérer les fonts pour PdfMake en ligne
const fonts = {
    Roboto: {
        normal: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.53/fonts/Roboto/Roboto-Regular.ttf',
        bold: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.53/fonts/Roboto/Roboto-Medium.ttf',
        italics: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.53/fonts/Roboto/Roboto-Italic.ttf',
        bolditalics: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.53/fonts/Roboto/Roboto-MediumItalic.ttf'
    }
};

class GenerateReport {
    constructor() {
        this.pdfPrinter = new PdfPrinter(fonts);
    }

    generatePdf(docDefinition) {
        return new Promise((resolve, reject) => {
            const pdfDoc = this.pdfPrinter.createPdfKitDocument(docDefinition);
            let chunks = [];
            pdfDoc.on('data', chunk => chunks.push(chunk));
            pdfDoc.on('end', () => resolve(Buffer.concat(chunks)));
            pdfDoc.on('error', err => reject(err));
            pdfDoc.end();
        });
    }

    generateRepportPlagiat({ 
        resultat_text,
        resultat_score,
        observation,
        etudiant_nom_complet,
        classe,
        logoUrl = process.env.LOGO || 'https://inbtp.net/config/inbtp-assets/images/logo-inbtp.png',
        nRef = 'N/A'
    }) {
        const docDefinition = {
            content: [
                {
                    stack: [ // Section en-tête
                        this.headerDocument(
                            'Rapport de Plagiat',
                            etudiant_nom_complet,
                            classe,
                            nRef,
                            logoUrl
                        )
                    ]
                },
                {
                    stack: [ // Section informations principales
                        { text: 'Rapport de Plagiat', style: 'header' },
                        { text: `Nom de l'étudiant: ${etudiant_nom_complet}`, style: 'subheader' },
                        { text: `Classe: ${classe}`, style: 'subheader' }
                    ],
                    unbreakable: true // Garde ces éléments ensemble
                },
                {
                    stack: [ // Section résultats
                        { text: 'Résultats', style: 'sectionHeader' },
                        { text: `Résultat: ${resultat_text}`, style: 'body' },
                        { text: `Score de Plagiat: ${resultat_score}`, style: 'body' }
                    ],
                    margin: [0, 20, 0, 20] // Marge [gauche, haut, droite, bas]
                },
                {
                    stack: [ // Section observations
                        { text: 'Observations', style: 'sectionHeader' },
                        { text: observation, style: 'body' }
                    ]
                }
            ],
            styles: {
                header: {
                    fontSize: 18,
                    bold: true,
                    marginBottom: 20
                },
                subheader: {
                    fontSize: 14,
                    marginBottom: 10
                },
                body: {
                    fontSize: 12,
                    marginBottom: 5
                },
                sectionHeader: {
                    fontSize: 16,
                    bold: true,
                    marginBottom: 10
                }
            }
        };

        return this.generatePdf(docDefinition);
    }

    generateBonDeCommande(commandeType, studentId, products, {
        titleRapport = 'Bon de Commande',
        studentMatricule = 'N/A',
        Departement = 'N/A',
        nRef = 'N/A',
        logoUrl = process.env.LOGO || 'https://inbtp.net/config/inbtp-assets/images/logo-inbtp.png'
    }) {
        // Calcul du total
        const total = products.reduce((sum, product) => sum + product.price, 0);
        
        // Données pour le QR Code
        const qrData = JSON.stringify({
            ref: 'https://inbtp.net/commande/' + commandeType + '/' + studentId,
            student: studentMatricule,
            total: total,
            date: new Date().toISOString()
        });

        const docDefinition = {
            content: [
                {
                    stack: [
                        this.headerDocument(titleRapport, studentMatricule, Departement, nRef, logoUrl)
                    ],
                    margin: [0, 0, 0, 20]
                },
                {
                    stack: [
                        { text: 'Détails de la Commande', style: 'sectionHeader' },
                        {
                            table: {
                                headerRows: 1,
                                widths: ['*', 'auto', 'auto', 'auto'],
                                body: [
                                    [
                                        { text: 'Produit', style: 'tableHeader' },
                                        { text: 'Quantité', style: 'tableHeader' },
                                        { text: 'Prix unitaire', style: 'tableHeader' },
                                        { text: 'Total', style: 'tableHeader' }
                                    ],
                                    ...products.map(product => [
                                        product.name,
                                        product.quantity || 1,
                                        `${product.price} FCFA`,
                                        `${(product.quantity || 1) * product.price} FCFA`
                                    ])
                                ]
                            },
                            layout: 'lightHorizontalLines'
                        }
                    ],
                    margin: [0, 0, 0, 20]
                },
                {
                    columns: [
                        {
                            stack: [
                                { text: 'Total à payer:', style: 'totalLabel' },
                                { text: `${total} FCFA`, style: 'totalAmount' },
                                { text: 'Mode de paiement: Orange Money', style: 'paymentMethod' },
                                { text: 'Tél: +243 XX XX XX XX', style: 'paymentInfo' }
                            ]
                        },
                        {
                            qr: qrData,
                            fit: 100,
                            margin: [20, 0, 0, 0]
                        }
                    ]
                },
                {
                    text: 'Validité: 24 heures',
                    style: 'validity',
                    margin: [0, 20, 0, 0]
                }
            ],
            footer: {
                stack: [
                    { text: 'INBTP - Institut National du Bâtiment et des Travaux Publics', alignment: 'center' },
                    { text: 'Ce bon de commande est valable uniquement avec un QR Code lisible', alignment: 'center', fontSize: 8 }
                ],
                margin: [40, 0]
            },
            styles: {
                headerBold: {
                    fontSize: 14,
                    bold: true,
                    margin: [0, 2, 0, 2]
                },
                headerNormal: {
                    fontSize: 12,
                    margin: [0, 2, 0, 2]
                },
                sectionHeader: {
                    fontSize: 16,
                    bold: true,
                    margin: [0, 0, 0, 10]
                },
                tableHeader: {
                    bold: true,
                    fontSize: 12,
                    fillColor: '#f8f9fa'
                },
                totalLabel: {
                    fontSize: 14,
                    bold: true,
                    margin: [0, 10, 0, 5]
                },
                totalAmount: {
                    fontSize: 18,
                    bold: true,
                    color: '#2c3e50'
                },
                paymentMethod: {
                    fontSize: 12,
                    margin: [0, 10, 0, 5]
                },
                paymentInfo: {
                    fontSize: 12
                },
                validity: {
                    fontSize: 10,
                    italics: true,
                    color: '#666'
                }
            }
        };

        return this.generatePdf(docDefinition);
    }

    headerDocument(titleRapport, studentMatricule, Departement, nRef, logoUrl) {
        return {
            columns: [
                {
                    width: '*',
                    stack: [
                        { 
                            text: 'République Démocratique du Congo', 
                            style: 'headerBold',
                            alignment: 'center'
                        },
                        { 
                            text: 'Ministère de l\'Enseignement Supérieur et Universitaire', 
                            style: 'headerNormal',
                            alignment: 'center'
                        },
                        { 
                            text: 'Institut National du Bâtiment et des Travaux Publics', 
                            style: 'headerNormal',
                            alignment: 'center',
                            margin: [0, 0, 0, 10]
                        },
                        {
                            image: logoUrl,
                            width: 80,
                            height: 80,
                            alignment: 'center'
                        },
                        { 
                            text: 'I.N.B.T.P', 
                            style: 'headerBold',
                            alignment: 'center',
                            margin: [0, 10]
                        },
                        { 
                            text: `Département: ${Departement}`,
                            style: 'headerNormal',
                            alignment: 'center'
                        }
                    ]
                },
                {
                    width: 'auto',
                    stack: [
                        {
                            text: `Date: ${new Date().toLocaleDateString('fr-FR')}`,
                            style: 'headerNormal',
                            alignment: 'right'
                        },
                        {
                            text: `Réf: ${nRef}`,
                            style: 'headerNormal',
                            alignment: 'right',
                            margin: [0, 5]
                        }
                    ]
                }
            ],
            margin: [0, 0, 0, 20]
        }
    }

}

module.exports = GenerateReport;
