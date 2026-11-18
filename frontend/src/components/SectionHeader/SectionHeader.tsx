import './SectionHeader.css'

type SectionHeaderProps = {
  title: string
  intro: string
  imageSrc?: string
  imageAlt?: string
  imageCredit?: string
}

// Intestazione di ogni sezione della dashboard: titolo, introduzione e foto opzionale
export default function SectionHeader({ title, intro, imageSrc, imageAlt = '', imageCredit }: SectionHeaderProps) {
  return (
    <header className={imageSrc ? 'section-header section-header-with-image' : 'section-header'}>
      {imageSrc && (
        <figure className="section-header-figure">
          <img className="section-header-image" src={imageSrc} alt={imageAlt} />
          {imageCredit && <figcaption className="section-header-credit">{imageCredit}</figcaption>}
        </figure>
      )}
      <div className="section-header-text">
        <h1 className="dashboard-title">{title}</h1>
        <p className="dashboard-intro">{intro}</p>
      </div>
    </header>
  )
}
