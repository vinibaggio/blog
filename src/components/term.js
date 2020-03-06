
import * as React from 'react';

// < !-- * Lactic Acid Bacteria(LAB): Lovely little bacteria that metabolize carbohydrates and produce lactic or acetic acid(the sour in sourdough), present in preserved foods such as kimchi, sauerkraut and guess what! sourdough. -- >
// <!-- * Coil fold: A technique to delicately work the gluten in the dough. -- >
const terms = {
  'Oven Spring': 'When the dough is placed inside the oven, the high temperature will stimulate the yeast to produce a lot of CO₂, causing the loaf to rapidly increase in size.A low oven spring means an under - developed dough.',
  'Gluten': 'Chains of aminoacids that give the bread its structure, by trapping CO₂–bread bakers live by it.',
  'Levain': 'Levain is the pre - ferment that we will mix with the flour and water to provide the rise.',
  'Scoring': 'Superficially cutting the bread to stimulate steam to be released in a specific pattern.',
  'Sourdough bread': 'Many people use this term to identify naturally - leavened dough and not that the flavor itself is entirely sour.A tiny bit of sourness is ok.',
  'Yeast': 'The fungi that live in your starter or that you can buy that will convert carbohydrates into carbon dioxide(CO₂) and alcohols, giving your bread the bubble.'
}

const TableOfTerms = () => {
  return (
    <ul>
      {Object.keys(terms).sort().map((k) => (<li>{k}: {terms[k]}</li>))}
    </ul>
  )
}

const Term = ({t: txt}) => {
  return (<abbr title={terms[txt]}>{txt}</abbr>)
}

export { TableOfTerms };
export default Term;
