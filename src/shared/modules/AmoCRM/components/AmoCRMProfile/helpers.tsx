export const RenderErrors = (errors: string) => {
  const errorList = errors.split(';').map(e => e.trim()).filter(Boolean);

  const senlerErrors = errorList.filter(e => e.toLowerCase().includes('Ошибка Сенлер'));
  const otherErrors = errorList.filter(e => !e.toLowerCase().includes('Ошибка Сенлер'));

  const displayErrors = [
    ...senlerErrors,
    ...otherErrors,
  ].filter(Boolean);

  if (displayErrors.length > 0) {
    return (
      <ul className="text-sm list-disc list-inside space-y-1">
        {displayErrors.map((err, idx) => (
          <li key={idx}>{err}</li>
        ))}
      </ul>
    );
  }

  return null;
}

