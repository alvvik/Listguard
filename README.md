# ListGuard

> System do rekrutacji i weryfikacji na serwery Discord, który łączy bota z panelem webowym opartym na Next.js.

![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Discord.js](https://img.shields.io/badge/Discord.js-5865F2?style=for-the-badge&logo=discord&logoColor=white)
![SQLite](https://img.shields.io/badge/SQLite-003B57?style=for-the-badge&logo=sqlite&logoColor=white)

---

## O projekcie

**ListGuard** został stworzony z myślą o właścicielach serwerów gier, którzy chcą uprościć i zautomatyzować proces przyjmowania użytkowników na whitelistę. Zamiast ręcznie sprawdzać każde podanie, można obsłużyć wszystko w jednym miejscu. Gracze mogą złożyć zgłoszenie bezpośrednio na stronie internetowej albo skorzystać z komend i formularzy na Discordzie.

---

## Kluczowe funkcje

- **Dwa sposoby składania podań:**
  - Przez komendę `/aplikuj` na Discordzie z wykorzystaniem formularzy.
  - Bezpośrednio na stronie internetowej, w panelu użytkownika.
- **Sprawdzanie statusu na bieżąco:** Użytkownik w każdej chwili może sprawdzić, czy jego podanie zostało zaakceptowane, czy odrzucone.
- **Bezpieczne API:** Endpointy backendowe są chronione tokenami autoryzacyjnymi, co ogranicza niepowołany dostęp.
- **Modułowa architektura bota:** Dodawanie nowych komend i eventów jest proste i nie wymaga dużych zmian w kodzie.

---

## Użyte technologie

- **Frontend i backend:** Next.js, Tailwind CSS
- **Baza danych:** SQLite, Drizzle ORM
- **Bot Discord:** Discord.js (TypeScript)

---

## Instalacja i uruchomienie lokalne

Wykonaj poniższe kroki, aby uruchomić projekt lokalnie:

### 1. Sklonuj repozytorium

```bash
git clone https://github.com/alvvik/Listguard
cd ListGuard
```

Przygotuj plik `.env` zgodnie z dostarczonym wzorem.

````bash
npm i
npx drizzle-kit push
npm run dev
npm run bot```
````

## Licencja

Ten projekt jest objęty licencją MIT – szczegóły znajdziesz w pliku [LICENSE](LICENSE).
