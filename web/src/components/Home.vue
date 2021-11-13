<template>
  <div>
    <div class="banner">
      <div class="banner-background" :style="`background-image:url(${landing});`"/>
      <div class="banner-content">
        <v-container>
          <v-layout>
            <v-flex xs12 md6>
              <h1>Easily set-up and test your single sign-on applications</h1>

              <h2 style="margin-top:40px;">IdP Manager</h2>
              <p>SSO Tools can quickly spin-up your own custom Identity Providers. Start testing your SAML2 applications in minutes.</p>
              <v-btn to="/idps/new" color="primary"><v-icon>add</v-icon> Create your own IdP</v-btn>
              <p><small>* It's free &amp; you don't need to register an account</small></p>
            </v-flex>
          </v-layout>
        </v-container>
      </div>
    </div>

    <v-container grid-list-xl>
      <v-layout :justify-center="true">
        <v-flex xs12 sm8 md6 lg4 style="text-align:center;">
          <h2>Get confident with your SSO apps</h2>
          <p>Develop and fully test out your applications with single sign-on to radically improve your offering for <strong>enterprise customers</strong>.</p>
          <p>SSO Tools is great for small SaaS organisations who need to learn about and <strong>provide federated authentication</strong> to their customers.</p>
        </v-flex>
      </v-layout>

      <v-layout style="margin-top:50px;" wrap>
        <v-flex xs12 md6>
          <h2>Quick and simple: we focus on the essentials</h2>
          <p>Use the SSO Tools sandbox to quickly spin-up identity providers, register users and set-up your service providers in order to test the entire SSO lifecycle.</p>
          <p>You don't need to worry about signing up for complicated SSO providers, and <strong>you don't even need an account to get started</strong>.</p>
        </v-flex>
        <v-flex xs12 md6>
          <img :src="usersImage" style="width:100%;border-radius:3px;box-shadow:0px 4px 10px rgba(0,0,0,0.2);" />
        </v-flex>
      </v-layout>

      <v-layout style="margin-top:50px;" wrap>
        <v-flex xs12 md6 order-xs2 order-md1>
          <img :src="secureImage" style="width:100%;border-radius:3px;box-shadow:0px 4px 10px rgba(0,0,0,0.2);" />
        </v-flex>
        <v-flex xs12 md6 order-xs1 order-md2>
          <h2>Personalised and secure</h2>
          <p>Each of your identity providers is given its own path at our IdP subdomain, allowing you to easily separate different IdP configurations for testing different functions.</p>
          <h2>Emulate a real-world IdP</h2>
          <p>SSO Tools allows you to run a typical IdP environment. Users associated with your provider can locally login to list your connected applications to test the login and logout flows.</p>
          <p>Support for both IdP and SP initiated sign-on is available, allowing you to test your applications under typical enterprise SSO usage. For example, if one of your customers has a link to sign-in to your app from their local intranet.</p>
        </v-flex>
      </v-layout>

      <v-layout style="margin-top:50px;" wrap>
        <v-flex xs12 md6>
          <h2>Follow industry standards</h2>
          <p>SSO Tools allows you to test your SSO implementations in your apps following protocols and standards used by the vast majority of large companies, educational institutions, government agencies, and more.</p>
          <p>We currently support the SAML2 protocol, which works well with your customers using LDAP and/or Microsoft Active Directory. Each IdP you create can have different settings to enable you to fully test out your services and your multi-tenancy support.</p>
        </v-flex>
        <v-flex xs12 md6>
          <img :src="samlImage" style="width:100%;border-radius:3px;box-shadow:0px 4px 10px rgba(0,0,0,0.2);" />
        </v-flex>
      </v-layout>

      <h1 style="margin-top:50px;">Features &amp; roadmap</h1>
      <p>SSO Tools is currently offered as a free service. It is maintained by a single developer for testing SAML2 SSO applications. It's not recommended for production use as there is no offer of guarantee for uptime! For any questions, or to get in touch, please do so via <a href="https://twitter.com/willwebberley" target="_blank" rel="noopener noreferrer">Twitter</a>.</p>

      <v-layout wrap>
        <v-flex sm6>
          <h2>What you get now</h2>
          <v-list dense style="margin-top:15px;">
            <v-list-tile v-for="feature in features" :key="feature" avatar>
              <v-list-tile-avatar>
                <v-icon style="color:green;">check_circle</v-icon>
              </v-list-tile-avatar>
              <v-list-tile-content>
                <v-list-tile-title>{{ feature }}</v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
          </v-list>
        </v-flex>

        <v-flex sm6>
          <h2>What's coming</h2>
          <v-list dense style="margin-top:15px;">
            <v-list-tile v-for="item in roadmap" :key="item" avatar>
              <v-list-tile-avatar>
                <v-icon style="color:rgb(200,200,200);">access_time</v-icon>
              </v-list-tile-avatar>
              <v-list-tile-content>
                <v-list-tile-title>{{ item }}</v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
          </v-list>
        </v-flex>
      </v-layout>

      <div style="margin: 50px 0px;"><v-divider /></div>

      
      <v-layout :justify-center="true">
        <v-flex xs12 sm10 md8 lg6>
          <h1>👋 Hi there, thanks for visiting</h1>
          <p>SSO Tools is created and maintained by a solo developer. During my work as part of a growing startup selling enterprise SaaS, the need for providing larger organisations with federated authentication became hugely important.</p>
          <p>I spent a lot of my spare time reading-up and learning about the different approaches to SSO via SAML2, with a focus on security whilst also making set-up easy for our customers.</p>
          <p>In my spare time I began working on SSO Tools so that I could easily test sign-on and logout flows across different use-cases.</p>
          <p>SSO Tools is free and open-source software, and you can <a href='https://git.wilw.dev/seastorm/sso-tools' target='_blank' rel='noopener noreferrer'>check out the source code</a> if you are interested. <strong>I hope you find it useful!</strong></p>
        </v-flex>
      </v-layout>

    </v-container>
  </div>
</template>

<script>
import api from '../api';
import landing from '../assets/landing.png';
import usersImage from '../assets/users.png';
import secureImage from '../assets/secure.png';
import samlImage from '../assets/saml.png';

export default {
  name: 'Home',
  data() {
    return {
      landing, usersImage, secureImage, samlImage,
      features: [
        'Account-less sandbox', 'Create unlimited IdPs', 'Register apps/SPs with your IdPs', 'Register users with your IdPs', 'Support for custom user attributes', 'Support for specifying custom attribute mappings', 'IdP authentication', 'IdP- and SP-initiated SAML2 sign-on', 'SAML2 ForceAuthn respected', 'SP-initiated log-out'
      ],
      roadmap: [
        'Request and response logging',
        'Full SAML2 SLO process (i.e. log-out all signed-in SPs)',
        'Improved certificate/signature handling',
        'Support for automatic metadata registration',
        'Support for metadata download',
        'OpenID Connect support',
        'Support for creating SPs for testing IdPs'
      ],
    }
  },
  created (){
  },
  methods: {
    
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
    position:relative;
    min-height:300px;
  }
</style>
