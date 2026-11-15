import HeroBanner from '../../../components/HeroBanner/HeroBanner'
import heroImage from '../../../assets/pexels-yves-b-893027791-39037173.jpg'
import Button from '@mui/material/Button'
import productionImage from '../../../assets/taken-olive-oil-610366.jpg'
import peopleImage from '../../../assets/pexels-silvia-10704974.jpg'
import byProductImage from '../../../assets/monfocus-soda-4017613.jpg'
import { useNavigate } from 'react-router'
import Card from '../../../components/Card/Card'
import ProcessFlow from '../../../components/ProcessFlow/ProcessFlow'
import InfoIcon from '@mui/icons-material/Info';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import GitHubIcon from '@mui/icons-material/GitHub';
import '../HomePage.css';

const processSteps = [
  { label: 'Olive', description: 'kg conferiti' },
  { label: 'Frangitore', description: 'kg lavorati, kWh, fermi' },
  { label: 'Decanter a 2 fasi', description: 'litri di olio, kWh, fermi' },
  { label: 'Olio EVO · sansa · acque di vegetazione', description: 'qualità e sottoprodotti recuperati' },
  { label: 'Dashboard KPI', description: 'OEE, costo fermi, CO₂/L' },
]

const cardList = [
  { imageSrc: productionImage, imageAlt: 'Linea di produzione dell\'olio', imageCredit: 'Foto di Taken su Pixabay', title: 'Misurare la produzione', label: 'Industria 4.0 · OEE, fermi, costi', text: 'Misurare la produzione rende chiara la perdita economica e le sue cause, così da cercare soluzioni mirate. Il prototipo potrà essere riutilizzato nelle campagne successive per verificare i miglioramenti ottenuti.' },
  { imageSrc: peopleImage, imageAlt: 'Mani che tengono olive appena raccolte', imageCredit: 'Foto di Silvia Beccari su Pexels', title: 'La persona al centro', label: 'Industria 5.0 · dati per decidere', text: 'Gli indicatori aiutano chi gestisce il frantoio a capire dove intervenire: per esempio se conviene acquistare macchinari più efficienti o ridurre i fermi più costosi. Nella sezione Parametri può vedere su quali valori sono calcolati i risultati.' },
  { imageSrc: byProductImage, imageAlt: 'Saponetta all\'olio d\'oliva', imageCredit: 'Foto di monfocus su Pixabay', title: 'Valorizzare gli scarti', label: 'Sostenibilità · polifenoli dalle acque di vegetazione', text: 'Sansa e acque di vegetazione sono sottoprodotti inquinanti e difficili da smaltire, ma possono diventare una risorsa. Dalle acque di vegetazione si recuperano polifenoli utili per integratori e cosmetici, grazie ad accordi con aziende partner. La piattaforma misura quanta parte degli scarti viene recuperata.' },
]

export default function ProjectSection() {
  const navigate = useNavigate()

  const goToDashboard = () => {
    navigate('/dashboard')
    window.scrollTo({ top: 0 })
  }

  return (
    <div className="project-page">
      <p className="info-text">
        <InfoIcon color="primary" /> Il frantoio è immaginario: i dati della piattaforma sono simulati e calibrati su valori pubblicati.
      </p>

      <HeroBanner badge="Caso di studio · Frantoio ad Alberobello" title="Frantoi in EVOluzione"
        subtitle="Dall'oliva al dato: costi, efficienza e sostenibilità nella terra dei trulli"
        imageSrc={heroImage} imageAlt="Trullo ad Alberobello"
        imageCredit="Foto di [nome fotografo], per gentile concessione"
        actionButtons={<><Button variant="contained" size="large" endIcon={<ArrowForwardIcon />} onClick={goToDashboard}>Vai alla dashboard</Button>
          <Button variant="outlined" size="large" startIcon={<GitHubIcon />} href="https://github.com/miri993/olive-mill-monitoring-platform" target="_blank" rel="noopener">Vai su GitHub</Button></>}>
          <p>Una piattaforma che analizza il processo di produzione dell’olio in un frantoio di Alberobello che lavora olive Coratina in monocultivar durante la campagna olearia 2025. Qui trovi i principali indicatori: OEE, fermi macchina, perdite economiche, scarti e loro riutilizzo, sostenibilità.</p>
      </HeroBanner>

      <section className="project-block">
        <h2 className="section-title">Le nostre idee</h2>
        <div className="ideas-grid">
          {cardList.map((card) => (
            <Card key={card.title} imageSrc={card.imageSrc} imageAlt={card.imageAlt} imageCredit={card.imageCredit} title={card.title} label={card.label}>
              <p>{card.text}</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="project-block">
        <h2 className="section-title">Dall'oliva al dato</h2>
        <ProcessFlow steps={processSteps} imageSrc={heroImage} imageAlt="Trullo ad Alberobello" imageCredit="Foto di Yves B. su Pexels" />
      </section>
    </div>
  )
}
