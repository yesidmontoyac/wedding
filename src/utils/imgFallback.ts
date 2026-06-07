const EXTENSIONS = ['jpg', 'JPG', 'jpeg', 'JPEG', 'png', 'PNG'];

function showPlaceholder(img: HTMLImageElement) {
  img.style.display = 'none';
  const placeholder = img.nextElementSibling as HTMLElement | null;
  if (placeholder) placeholder.style.display = 'flex';
}

export function handleImgError(e: React.SyntheticEvent<HTMLImageElement>) {
  const img = e.currentTarget;

  // Drive / external CDN → show placeholder immediately, extension retries don't apply
  if (img.src.includes('googleusercontent.com') || img.src.includes('drive.google.com')) {
    showPlaceholder(img);
    return;
  }

  const attempt = parseInt(img.dataset.attempt ?? '0');
  const nextAttempt = attempt + 1;

  if (nextAttempt < EXTENSIONS.length) {
    img.dataset.attempt = String(nextAttempt);
    img.src = img.src.replace(/\.[^.]+$/, `.${EXTENSIONS[nextAttempt]}`);
  } else {
    showPlaceholder(img);
  }
}
