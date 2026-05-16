import TranslateTo from "@/components/editor/TranslateTo";

export default function SectionTranslate({ section, translate }) {
  const active = translate.openSection === section;
  return (
    <TranslateTo
      section={section}
      status={active ? translate.status : "idle"}
      error={active ? translate.error : null}
      isOpen={active}
      onOpen={() => translate.open(section)}
      onClose={translate.close}
      onTranslate={translate.translate}
      isPro={translate.isPro}
      onUpgrade={translate.onUpgrade}
    />
  );
}
