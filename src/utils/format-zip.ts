export function formatZip(zip: string) {
  console.log(zip)

  const slicedZip = zip.slice(0, 5)
  const zipWithDash = `${slicedZip}-${zip.slice(5)}`

  return zipWithDash
}
