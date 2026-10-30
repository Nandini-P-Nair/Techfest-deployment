const shots = [
  'Opening ceremony', 'Hackathon night', 'Robo Race finals',
  'Cloud workshop', 'Open mic crowd', 'Futsal final',
];

export default function Gallery() {
  return (
    <section>
      <h2>Gallery</h2>
      <div className="grid photos">
        {shots.map((alt, i) => (
          <figure key={alt}>
            <img src={`/gallery/g${i + 1}.svg`} alt={alt} width="480" height="320" loading="lazy" decoding="async" />
            <figcaption>{alt}</figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
