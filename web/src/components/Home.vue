<template>
  <div>
    <div class="bg-indigo-lighten-5">
      <v-container class="d-block d-sm-flex align-center">
      <div class="w-auto pa-5">
        <h1 class="mb-5">Set-up and test single sign-on in your web, mobile, and desktop apps</h1>
        <p>With SSO Tools it is easy to spin-up your own custom identity providers, allowing you to start testing your <span class="bg-yellow-lighten-3 rounded-md pa-1">SAML2</span> applications in minutes.</p>
        <v-btn class="mt-5" to="/idps/new" color="primary" prepend-icon="mdi-plus"> Create your own IdP</v-btn>
        <div class="d-flex align-center mt-2">
          <v-icon icon="mdi-star" class="mr-2 text-primary" />
          <p><small>It's free &amp; you don't have to register an account</small></p>
        </div>
        <div class="d-flex align-center mt-1">
          <v-icon icon="mdi-star" class="mr-2 text-primary" />
          <p><small>SSO Tools is fully open-source</small></p>
        </div>
      </div>
      <div class="w-auto">
        <img v-bind:src="landingImage" class="w-100"/>
      </div>
      </v-container>
    </div>

    <v-container>
    <div class="text-center mt-10 ml-5 mr-5">
      <h2>Get confident with your SSO apps</h2>
      <p>Develop and fully test out your applications with single sign-on to radically improve your offering for <strong>enterprise customers</strong>.</p>
      <p>SSO Tools is great for small SaaS organisations who need to learn about and <strong>provide federated authentication</strong> to their customers.</p>
    </div>

    <div class="d-block d-sm-flex ml-5 ml-sm-16 mr-5 mr-sm-16 mt-16">
      <div class="w-auto mr-5 mb-5">
        <h2>Quick and simple: we focus on the essentials</h2>
        <p>Use the SSO Tools sandbox to quickly spin-up identity providers, register users and set-up your service providers in order to test the entire SSO lifecycle.</p>
        <p>You don't need to worry about signing up for complicated SSO providers, and <strong>you don't even need an account to get started</strong>.</p>
      </div>
      <div class="w-auto">
        <img :src="usersImage" style="width:100%;border-radius:3px;box-shadow:0px 4px 10px rgba(0,0,0,0.2);" />
      </div>
    </div>

    <div class="d-block d-sm-flex ml-5 ml-sm-16 mr-5 mr-sm-16 mt-16">
      <div class="w-auto">
        <img :src="secureImage" style="width:100%;border-radius:3px;box-shadow:0px 4px 10px rgba(0,0,0,0.2);" />
      </div>
      <div class="w-auto ml-5 mt-5">
        <h2>Personalised and secure</h2>
        <p>Each of your identity providers is given its own path at our IdP subdomain, allowing you to easily separate different IdP configurations for testing different functions.</p>
        <h2 class="mt-5">Emulate a real-world IdP</h2>
        <p>SSO Tools allows you to run a typical IdP environment. Users associated with your provider can locally login to list your connected applications to test the login and logout flows.</p>
        <p>Support for both IdP and SP initiated sign-on is available, allowing you to test your applications under typical enterprise SSO usage. For example, if one of your customers has a link to sign-in to your app from their local intranet.</p>
      </div>
    </div>

    <div class="d-block d-sm-flex ml-5 ml-sm-16 mr-5 mr-sm-16 mt-16">
      <div class="w-auto mr-5 mb-5">
        <h2>Follow industry standards</h2>
        <p>SSO Tools allows you to test your SSO implementations in your apps following protocols and standards used by the vast majority of large companies, educational institutions, government agencies, and more.</p>
        <p>We currently support the SAML2 protocol, which works well with your customers using LDAP and/or Microsoft Active Directory. Each IdP you create can have different settings to enable you to fully test out your services and your multi-tenancy support.</p>
      </div>
      <div class="w-auto">
        <img :src="samlImage" style="width:100%;border-radius:3px;box-shadow:0px 4px 10px rgba(0,0,0,0.2);" />
      </div>
    </div>

    <div class="d-flex flex-column align-center bg-indigo-lighten-5 mt-16 pa-10 rounded-lg elevation-5">
      <div class="w-75">
        <h1>Features &amp; roadmap</h1>
        <p>SSO Tools is offered as a free service. For any questions, or to get in touch, please do so via <a href="mailto:hello@sso.tools" target="_blank" rel="noopener noreferrer">email</a>.</p>
      </div>

      <div class="d-block d-sm-flex mt-10">
        <div class="mr-2">
          <h3>What you get now</h3>
          <v-list>
            <v-list-item v-for="feature in features" :key="feature">
              <v-list-item-icon><v-icon icon="mdi-check-circle" class="text-green mr-2"/></v-list-item-icon>
              <v-list-item-content>
                {{ feature }}
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </div>

        <div class="mt-5 mt-sm-0">
          <h3>What's coming</h3>
          <v-list>
            <v-list-item v-for="item in roadmap" :key="item" avatar>
              <v-list-item-icon><v-icon icon="mdi-clock-outline" class="text-grey-lighten-1 mr-2" /></v-list-item-icon>
              <v-list-item-content>
                {{ item }}
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </div>
      </div>
    </div>

    <div class="mt-10 d-flex justify-center">
      <div class="w-75">
        <h1 class="mb-8">👋 Hi there, thanks for visiting</h1>
        <p class="mb-2">SSO Tools is created and maintained by a solo developer. During my work as part of a growing startup selling enterprise SaaS, the need for providing larger organisations with federated authentication became hugely important.</p>
        <p class="mb-2">I spent a lot of my spare time reading-up and learning about the different approaches to SSO via SAML2, with a focus on security whilst also making set-up easy for our customers.</p>
        <p class="mb-2">In my spare time I began working on SSO Tools so that I could easily test sign-on and logout flows across different use-cases.</p>
        <p class="mb-2">SSO Tools is free and open-source software, and you can <a href='https://git.wilw.dev/wilw/sso-tools' target='_blank' rel='noopener noreferrer'>check out the source code</a> if you are interested. <strong>I hope you find it useful!</strong></p>
      </div>
    </div>

    </v-container>
  </div>
</template>

<script>
import landingImage from '../assets/login.png';
import usersImage from '../assets/users.png';
import secureImage from '../assets/secure.png';
import samlImage from '../assets/saml.png';

export default {
  name: 'Home',
  data() {
    return {
      landingImage, usersImage, secureImage, samlImage,
      features: [
        'Create unlimited IdPs and apps', 'Support for custom user attributes & mappings', 'IdP- and SP-initiated SAML2 sign-on', 'SAML2 ForceAuthn respected', 'SP-initiated log-out', 'Request and response logging'
      ],
      roadmap: [
        'OAuth2 and OpenID Connect support',
        'Full SAML2 SLO process (i.e. log-out all signed-in SPs)',
        'Improved certificate/signature handling',
        'Support for automatic metadata registration',
        'Support for metadata download',
      ],
    }
  },
}
</script>

<style scoped>
  .banner{
    min-height:300px;
    position:relative;
  }
  .banner-background{
    background-size:cover;
    background-position:center bottom;
    position:absolute;
    width:100%;
    height:100%;
    left:0;top:0;

  }
  .banner-content{
    position: relative;
  }
</style>
