import './ProcessFlow.css'

export type ProcessStep = {
  label: string
  description?: string
}

type ProcessFlowProps = {
  steps: ProcessStep[]
  imageSrc?: string
  imageAlt?: string
  imageCredit?: string
}

export default function ProcessFlow({ steps, imageSrc, imageAlt, imageCredit }: ProcessFlowProps) {
  return (
    <div className="process-flow">
      <ol className="process-flow-steps">
        {steps.map((step) => (
          <li key={step.label} className="process-flow-step">
            <span className="process-flow-label">{step.label}</span>
            {step.description && <span className="process-flow-description">{step.description}</span>}
          </li>
        ))}
      </ol>
      {imageSrc && (
        <figure className="process-flow-figure">
          <img className="process-flow-image" src={imageSrc} alt={imageAlt ?? ''} />
          {imageCredit && <figcaption className="process-flow-credit">{imageCredit}</figcaption>}
        </figure>
      )}
      {!imageSrc && imageAlt && <div className="process-flow-image process-flow-image-placeholder">[Foto: {imageAlt}]</div>}
    </div>
  )
}
