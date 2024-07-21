import React from 'react';

const SectionContainer = ({ children }) => (
  <div className="max-w-6xl mx-auto bg-white border-gray-200 center mt-10">{children}</div>
);
const TwoColumnSection = ({ children }) => (
  <div className="flex flex-wrap justify-center -mx-4">{children}</div>
);

const LeftColumn = ({ children }) => (
  <div className="w-full md:w-1/2 px-4 mb-8 md:mb-0">{children}</div>
);

const RightColumn = ({ children }) => (
  <div className="w-full md:w-1/2 px-4 mb-8 md:mb-0">{children}</div>
);
const HomeSection = () => (
  <SectionContainer>
    <TwoColumnSection>
      
    <LeftColumn>
      <section className="p-10 ">
        <h2 className="text-3xl font-bold mb-4">Bem-vindo ao ServeFixe!</h2>
        <p className="text-gray-700 mb-1">
          ServeFixe é um sistema para Gestão de Restaurantes, uma solução que veio para revolucionar o mercado Hoteleiro!
        </p> 
        <p className="text-gray-700">ServeFixe tem uma versão mobile para os garçons e aversão web para a cozinha e o caixa, todos os acessos é mediante um perfil,
          atarves do nosso aplicativo o teu restaurante poderá receber reservas, e muitos clintes terão acesso aos teus menús, as tuas promoções e novidades so com um clicke.</p>
      </section>
    </LeftColumn>
    <RightColumn>
    <section className="p-10">
        <h2 className="text-3xl font-bold mb-4">Imagens</h2>
        
      </section>
    </RightColumn>
  </TwoColumnSection>
  </SectionContainer>
);

const DownloadSection = () => (
  <SectionContainer>
    <section className=" p-8 center">
      <h2 className="text-3xl font-bold mb-4">Download Our App</h2>
      <p>
        Get the latest version of our app and experience a new level of convenience.
      </p>
    </section>
  </SectionContainer>
);

const SignupSection = () => (
  <SectionContainer>
    <section className=" p-8">
      <h2 className="text-3xl font-bold mb-4">Sign Up Today!</h2>
      <p>
        Join our community and enjoy exclusive benefits. Sign up now to get started.
      </p>
    </section>
  </SectionContainer>
);

const ContactSection = () => (
  <SectionContainer>
    <section className="p-8">
      <h2 className="text-3xl font-bold mb-4">Contact Us</h2>
      <p>
        Have questions? Reach out to us for support and assistance.
      </p>
    </section>
  </SectionContainer>
);

export { HomeSection, DownloadSection, SignupSection, ContactSection };
