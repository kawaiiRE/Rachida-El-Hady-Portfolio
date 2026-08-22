<template>
  <section class="analytics-page" data-analytics-ignore>
    <div class="shell">
      <header class="header">
        <div>
          <p class="eyebrow">Private Analytics</p>
          <h1 class="title">Portfolio Traffic</h1>
        </div>

        <div class="header-actions">
          <div v-if="summary" class="status" :class="storageClass">
            {{ storageLabel }}
          </div>
          <button
            v-if="hasToken"
            class="button"
            type="button"
            :disabled="isLoading"
            @click="loadAnalytics"
          >
            {{ isLoading ? 'Loading' : 'Refresh' }}
          </button>
          <button v-if="hasToken" class="button" type="button" @click="clearToken">Lock</button>
        </div>
      </header>

      <form v-if="!hasToken" class="auth" @submit.prevent="saveToken">
        <label class="label" for="analytics-token">Admin token</label>
        <div class="token-row">
          <input
            id="analytics-token"
            v-model="tokenInput"
            class="input"
            type="password"
            autocomplete="off"
          />
          <button class="button button--primary" type="submit">Open Dashboard</button>
        </div>
      </form>

      <template v-else>
        <form class="filter-panel" @submit.prevent="applyFilters">
          <div class="quick-ranges" aria-label="Quick date ranges">
            <button
              v-for="range in quickRanges"
              :key="range.id"
              class="range-button"
              type="button"
              @click="setQuickRange(range.days)"
            >
              {{ range.label }}
            </button>
          </div>

          <div class="filter-grid">
            <label class="control control--wide">
              <span>Search</span>
              <input v-model="draftFilters.q" class="input" type="search" autocomplete="off" />
            </label>

            <label class="control">
              <span>From</span>
              <input v-model="draftFilters.from" class="input" type="date" />
            </label>

            <label class="control">
              <span>To</span>
              <input v-model="draftFilters.to" class="input" type="date" />
            </label>

            <label class="control">
              <span>Event</span>
              <select v-model="draftFilters.eventName" class="select">
                <option value="">All events</option>
                <option
                  v-for="option in filterOptions.eventNames"
                  :key="option.value"
                  :value="option.value"
                >
                  {{ formatOptionLabel(option) }}
                </option>
              </select>
            </label>

            <label class="control">
              <span>Country</span>
              <select v-model="draftFilters.countryCode" class="select">
                <option value="">All countries</option>
                <option
                  v-for="option in filterOptions.countryCodes"
                  :key="option.value"
                  :value="option.value"
                >
                  {{ formatOptionLabel(option) }}
                </option>
              </select>
            </label>

            <label class="control">
              <span>City</span>
              <select v-model="draftFilters.city" class="select">
                <option value="">All cities</option>
                <option
                  v-for="option in filterOptions.cities"
                  :key="option.value"
                  :value="option.value"
                >
                  {{ formatOptionLabel(option) }}
                </option>
              </select>
            </label>

            <label class="control">
              <span>Region</span>
              <select v-model="draftFilters.region" class="select">
                <option value="">All regions</option>
                <option
                  v-for="option in filterOptions.regions"
                  :key="option.value"
                  :value="option.value"
                >
                  {{ formatOptionLabel(option) }}
                </option>
              </select>
            </label>

            <label class="control">
              <span>Postal</span>
              <select v-model="draftFilters.postalCode" class="select">
                <option value="">All postal codes</option>
                <option
                  v-for="option in filterOptions.postalCodes"
                  :key="option.value"
                  :value="option.value"
                >
                  {{ formatOptionLabel(option) }}
                </option>
              </select>
            </label>

            <label class="control">
              <span>Edge</span>
              <select v-model="draftFilters.colo" class="select">
                <option value="">All edges</option>
                <option
                  v-for="option in filterOptions.colos"
                  :key="option.value"
                  :value="option.value"
                >
                  {{ formatOptionLabel(option) }}
                </option>
              </select>
            </label>

            <label class="control">
              <span>Campaign</span>
              <select v-model="draftFilters.utmCampaign" class="select">
                <option value="">All campaigns</option>
                <option
                  v-for="option in filterOptions.utmCampaigns"
                  :key="option.value"
                  :value="option.value"
                >
                  {{ formatOptionLabel(option) }}
                </option>
              </select>
            </label>

            <label class="control">
              <span>Source</span>
              <select v-model="draftFilters.utmSource" class="select">
                <option value="">All sources</option>
                <option
                  v-for="option in filterOptions.utmSources"
                  :key="option.value"
                  :value="option.value"
                >
                  {{ formatOptionLabel(option) }}
                </option>
              </select>
            </label>

            <label class="control">
              <span>Medium</span>
              <select v-model="draftFilters.utmMedium" class="select">
                <option value="">All mediums</option>
                <option
                  v-for="option in filterOptions.utmMediums"
                  :key="option.value"
                  :value="option.value"
                >
                  {{ formatOptionLabel(option) }}
                </option>
              </select>
            </label>

            <label class="control">
              <span>Ad City</span>
              <select v-model="draftFilters.adCity" class="select">
                <option value="">All ad cities</option>
                <option
                  v-for="option in filterOptions.adCities"
                  :key="option.value"
                  :value="option.value"
                >
                  {{ formatOptionLabel(option) }}
                </option>
              </select>
            </label>

            <label class="control">
              <span>Ad Region</span>
              <select v-model="draftFilters.adRegion" class="select">
                <option value="">All ad regions</option>
                <option
                  v-for="option in filterOptions.adRegions"
                  :key="option.value"
                  :value="option.value"
                >
                  {{ formatOptionLabel(option) }}
                </option>
              </select>
            </label>

            <label class="control">
              <span>Ad Country</span>
              <select v-model="draftFilters.adCountry" class="select">
                <option value="">All ad countries</option>
                <option
                  v-for="option in filterOptions.adCountries"
                  :key="option.value"
                  :value="option.value"
                >
                  {{ formatOptionLabel(option) }}
                </option>
              </select>
            </label>

            <label class="control control--wide">
              <span>Page</span>
              <select v-model="draftFilters.pagePath" class="select">
                <option value="">All pages</option>
                <option
                  v-for="option in filterOptions.pagePaths"
                  :key="option.value"
                  :value="option.value"
                >
                  {{ formatOptionLabel(option) }}
                </option>
              </select>
            </label>

            <label class="control">
              <span>Device</span>
              <select v-model="draftFilters.device" class="select">
                <option value="">All devices</option>
                <option
                  v-for="option in filterOptions.devices"
                  :key="option.value"
                  :value="option.value"
                >
                  {{ formatOptionLabel(option) }}
                </option>
              </select>
            </label>

            <label class="control">
              <span>Referrer</span>
              <select v-model="draftFilters.referrerHost" class="select">
                <option value="">All referrers</option>
                <option
                  v-for="option in filterOptions.referrerHosts"
                  :key="option.value"
                  :value="option.value"
                >
                  {{ formatOptionLabel(option) }}
                </option>
              </select>
            </label>

            <label class="control">
              <span>Geo Level</span>
              <select v-model="draftFilters.precision" class="select">
                <option value="">All levels</option>
                <option
                  v-for="option in filterOptions.precision"
                  :key="option.value"
                  :value="option.value"
                >
                  {{ formatOptionLabel(option) }}
                </option>
              </select>
            </label>

            <label class="control">
              <span>Provider</span>
              <select v-model="draftFilters.provider" class="select">
                <option value="">All providers</option>
                <option
                  v-for="option in filterOptions.providers"
                  :key="option.value"
                  :value="option.value"
                >
                  {{ formatOptionLabel(option) }}
                </option>
              </select>
            </label>

            <label class="control">
              <span>Outbound</span>
              <select v-model="draftFilters.outbound" class="select">
                <option value="">All clicks</option>
                <option value="true">Outbound only</option>
                <option value="false">Internal only</option>
              </select>
            </label>

            <label class="control">
              <span>Scan</span>
              <select v-model.number="limit" class="select">
                <option :value="1000">1,000</option>
                <option :value="5000">5,000</option>
                <option :value="10000">10,000</option>
                <option :value="25000">25,000</option>
                <option :value="50000">50,000</option>
              </select>
            </label>

            <label class="control">
              <span>Sort</span>
              <select v-model="sortMetric" class="select">
                <option value="uniqueVisitors">Visitors</option>
                <option value="uniqueSessions">Sessions</option>
                <option value="pageViews">Views</option>
                <option value="clicks">Clicks</option>
                <option value="events">Events</option>
              </select>
            </label>
          </div>

          <div class="filter-actions">
            <button class="button button--primary" type="submit">Apply Filters</button>
            <button class="button" type="button" @click="resetFilters">Reset</button>
            <button class="button" type="button" @click="exportEventsCsv">Export Events</button>
          </div>
        </form>

        <div v-if="activeFilterChips.length" class="chips">
          <button
            v-for="chip in activeFilterChips"
            :key="chip.key"
            class="chip"
            type="button"
            @click="clearFilter(chip.key)"
          >
            <span>{{ chip.label }}</span>
            <strong>{{ chip.value }}</strong>
          </button>
        </div>

        <p v-if="errorMessage" class="error">{{ errorMessage }}</p>

        <div v-if="isLoading && !summary" class="loading">Loading analytics</div>

        <div v-if="summary" class="content" :class="{ 'is-loading': isLoading }">
          <section class="metrics" aria-label="Analytics metrics">
            <article v-for="metric in metrics" :key="metric.label" class="metric">
              <span class="metric-label">{{ metric.label }}</span>
              <strong class="metric-value">{{ metric.value }}</strong>
              <span class="metric-sub">{{ metric.sub }}</span>
            </article>
          </section>

          <section v-if="summary.storage === 'unconfigured'" class="notice">
            D1 is not bound yet. Add a Cloudflare D1 binding named ANALYTICS_DB and redeploy.
          </section>
          <section v-if="geoMissingNotice" class="notice">
            {{ geoMissingNotice }}
          </section>
          <section v-if="geoAccuracyNotice" class="notice">
            {{ geoAccuracyNotice }}
          </section>

          <nav class="tabs" aria-label="Analytics views">
            <button
              v-for="tab in tabs"
              :key="tab.id"
              class="tab"
              :class="{ 'tab--active': activeTab === tab.id }"
              type="button"
              @click="activeTab = tab.id"
            >
              {{ tab.label }}
            </button>
          </nav>

          <section v-if="activeTab === 'overview'" class="dashboard-grid">
            <article class="panel panel--wide">
              <header class="panel-header">
                <h2>Traffic Timeline</h2>
                <span>{{ dayRows.length }} days</span>
              </header>
              <div v-if="dayRows.length" class="bar-chart">
                <div
                  v-for="row in dayRows"
                  :key="row.date"
                  class="bar-column"
                  :title="`${formatDay(row.date)}: ${formatNumber(row.stats.events)} events`"
                >
                  <span class="bar" :style="{ height: getDayHeight(row) }" />
                  <small>{{ formatDay(row.date) }}</small>
                </div>
              </div>
              <p v-else class="empty">No timeline data</p>
            </article>

            <article class="panel">
              <header class="panel-header">
                <h2>Hourly Pattern</h2>
                <span>UTC</span>
              </header>
              <div class="hour-chart">
                <div class="hour-axis" aria-hidden="true">
                  <span v-for="(label, index) in hourAxisLabels" :key="`${label}-${index}`">
                    {{ formatNumber(label) }}
                  </span>
                </div>

                <div class="hour-plot">
                  <svg
                    class="hour-svg"
                    viewBox="0 0 100 100"
                    preserveAspectRatio="none"
                    aria-hidden="true"
                  >
                    <polygon class="hour-area" :points="hourAreaPoints" />
                    <polyline class="hour-line" :points="hourPolylinePoints" />
                  </svg>

                  <span
                    v-for="point in hourChartPoints"
                    :key="point.hour"
                    class="hour-dot"
                    :style="{ left: `${point.x}%`, top: `${point.y}%` }"
                    :title="`${point.hour}:00 - ${formatNumber(point.stats.events)} events`"
                  >
                    <strong>{{ formatNumber(point.stats.events) }}</strong>
                  </span>

                  <div class="hour-labels" aria-hidden="true">
                    <span
                      v-for="point in hourChartPoints"
                      v-show="isHourTick(point.hour)"
                      :key="`label-${point.hour}`"
                      :style="{ left: `${point.x}%` }"
                    >
                      {{ point.hour }}
                    </span>
                  </div>
                </div>
              </div>
            </article>

            <AnalyticsList
              title="Top Countries"
              :items="countryRows"
              empty-label="No country data yet"
            />
            <AnalyticsList
              title="Lebanon Locations"
              :items="lebanonCityRows"
              empty-label="No LB city data yet"
            />
            <AnalyticsList
              title="Ad Target Locations"
              :items="adTargetRows"
              empty-label="No ad target data yet"
            />
            <AnalyticsList
              title="Top Campaigns"
              :items="campaignRows"
              empty-label="No campaign data yet"
            />
            <AnalyticsList title="Top Pages" :items="pageRows" empty-label="No page data yet" />
            <AnalyticsList title="Top Clicks" :items="clickRows" empty-label="No clicks yet" />
            <AnalyticsList
              title="Geo Detail Level"
              :items="precisionRows"
              empty-label="No geo data yet"
            />
          </section>

          <section v-if="activeTab === 'geo'" class="tables-grid">
            <article class="panel">
              <header class="panel-header">
                <h2>Countries</h2>
                <span>{{ countryTableRows.length }} rows</span>
              </header>
              <div class="table-wrap">
                <table class="table table--compact">
                  <thead>
                    <tr>
                      <th>Country</th>
                      <th>Visitors</th>
                      <th>Sessions</th>
                      <th>Views</th>
                      <th>Clicks</th>
                      <th>Events</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="row in countryTableRows" :key="row.countryCode">
                      <td>{{ getCountryLabel(row) }}</td>
                      <td>{{ formatNumber(row.stats.uniqueVisitors) }}</td>
                      <td>{{ formatNumber(row.stats.uniqueSessions) }}</td>
                      <td>{{ formatNumber(row.stats.pageViews) }}</td>
                      <td>{{ formatNumber(row.stats.clicks) }}</td>
                      <td>{{ formatNumber(row.stats.events) }}</td>
                    </tr>
                  </tbody>
                </table>
                <p v-if="!countryTableRows.length" class="empty">No country rows</p>
              </div>
            </article>

            <article class="panel">
              <header class="panel-header">
                <h2>Lebanon Locations</h2>
                <span>{{ lebanonTableRows.length }} rows</span>
              </header>
              <div class="table-wrap">
                <table class="table">
                  <thead>
                    <tr>
                      <th>City</th>
                      <th>Visitors</th>
                      <th>Sessions</th>
                      <th>Views</th>
                      <th>Clicks</th>
                      <th>Rate</th>
                      <th>Scroll</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="row in lebanonTableRows" :key="getLocationLabel(row)">
                      <td>{{ getLocationLabel(row) }}</td>
                      <td>{{ formatNumber(row.stats.uniqueVisitors) }}</td>
                      <td>{{ formatNumber(row.stats.uniqueSessions) }}</td>
                      <td>{{ formatNumber(row.stats.pageViews) }}</td>
                      <td>{{ formatNumber(row.stats.clicks) }}</td>
                      <td>{{ formatPercent(row.stats.clickRate) }}</td>
                      <td>{{ formatPercent(row.stats.avgScrollDepth) }}</td>
                    </tr>
                  </tbody>
                </table>
                <p v-if="!lebanonTableRows.length" class="empty">No Lebanon rows</p>
              </div>
            </article>

            <article class="panel">
              <header class="panel-header">
                <h2>Precise Lebanon Geo</h2>
                <span>{{ lebanonPreciseTableRows.length }} rows</span>
              </header>
              <div class="table-wrap">
                <table class="table">
                  <thead>
                    <tr>
                      <th>Location</th>
                      <th>Finer Fields</th>
                      <th>Level</th>
                      <th>Provider</th>
                      <th>Visitors</th>
                      <th>Sessions</th>
                      <th>Views</th>
                      <th>Clicks</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="row in lebanonPreciseTableRows" :key="getRowKey(row)">
                      <td>{{ getLocationLabel(row) }}</td>
                      <td>{{ getPreciseLocationMeta(row) }}</td>
                      <td>{{ formatPrecisionLabel(row.precision || '') }}</td>
                      <td>{{ formatProviderLabel(row.provider || '') }}</td>
                      <td>{{ formatNumber(row.stats.uniqueVisitors) }}</td>
                      <td>{{ formatNumber(row.stats.uniqueSessions) }}</td>
                      <td>{{ formatNumber(row.stats.pageViews) }}</td>
                      <td>{{ formatNumber(row.stats.clicks) }}</td>
                    </tr>
                  </tbody>
                </table>
                <p v-if="!lebanonPreciseTableRows.length" class="empty">No precise Lebanon rows</p>
              </div>
            </article>

            <article class="panel">
              <header class="panel-header">
                <h2>Visitor Locations</h2>
                <span>{{ locationTableRows.length }} rows</span>
              </header>
              <div class="table-wrap">
                <table class="table">
                  <thead>
                    <tr>
                      <th>Location</th>
                      <th>Visitors</th>
                      <th>Sessions</th>
                      <th>Views</th>
                      <th>Clicks</th>
                      <th>Events</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="row in locationTableRows" :key="getLocationLabel(row)">
                      <td>{{ getLocationLabel(row) }}</td>
                      <td>{{ formatNumber(row.stats.uniqueVisitors) }}</td>
                      <td>{{ formatNumber(row.stats.uniqueSessions) }}</td>
                      <td>{{ formatNumber(row.stats.pageViews) }}</td>
                      <td>{{ formatNumber(row.stats.clicks) }}</td>
                      <td>{{ formatNumber(row.stats.events) }}</td>
                    </tr>
                  </tbody>
                </table>
                <p v-if="!locationTableRows.length" class="empty">No location rows</p>
              </div>
            </article>

            <article class="panel">
              <header class="panel-header">
                <h2>Precise Locations</h2>
                <span>{{ preciseLocationTableRows.length }} rows</span>
              </header>
              <div class="table-wrap">
                <table class="table">
                  <thead>
                    <tr>
                      <th>Location</th>
                      <th>Finer Fields</th>
                      <th>Level</th>
                      <th>Provider</th>
                      <th>Visitors</th>
                      <th>Sessions</th>
                      <th>Views</th>
                      <th>Events</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="row in preciseLocationTableRows" :key="getRowKey(row)">
                      <td>{{ getLocationLabel(row) }}</td>
                      <td>{{ getPreciseLocationMeta(row) }}</td>
                      <td>{{ formatPrecisionLabel(row.precision || '') }}</td>
                      <td>{{ formatProviderLabel(row.provider || '') }}</td>
                      <td>{{ formatNumber(row.stats.uniqueVisitors) }}</td>
                      <td>{{ formatNumber(row.stats.uniqueSessions) }}</td>
                      <td>{{ formatNumber(row.stats.pageViews) }}</td>
                      <td>{{ formatNumber(row.stats.events) }}</td>
                    </tr>
                  </tbody>
                </table>
                <p v-if="!preciseLocationTableRows.length" class="empty">
                  No precise location rows
                </p>
              </div>
            </article>

            <article class="panel">
              <header class="panel-header">
                <h2>Geo Providers</h2>
                <span>{{ providerTableRows.length }} rows</span>
              </header>
              <div class="table-wrap">
                <table class="table table--compact">
                  <thead>
                    <tr>
                      <th>Provider</th>
                      <th>Events</th>
                      <th>Visitors</th>
                      <th>Sessions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="row in providerTableRows" :key="row.name">
                      <td>{{ formatProviderLabel(row.name) }}</td>
                      <td>{{ formatNumber(row.stats.events) }}</td>
                      <td>{{ formatNumber(row.stats.uniqueVisitors) }}</td>
                      <td>{{ formatNumber(row.stats.uniqueSessions) }}</td>
                    </tr>
                  </tbody>
                </table>
                <p v-if="!providerTableRows.length" class="empty">No geo provider rows</p>
              </div>
            </article>

            <article class="panel">
              <header class="panel-header">
                <h2>Geo Quality</h2>
                <span>{{ geoQualityTableRows.length }} rows</span>
              </header>
              <div class="table-wrap">
                <table class="table table--compact">
                  <thead>
                    <tr>
                      <th>Provider</th>
                      <th>Level</th>
                      <th>Edge</th>
                      <th>Postal</th>
                      <th>Coords</th>
                      <th>Events</th>
                      <th>Visitors</th>
                      <th>Sessions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="row in geoQualityTableRows"
                      :key="`${row.provider}-${row.precision}-${row.colo}-${row.hasPostalCode}-${row.hasCoordinates}`"
                    >
                      <td>{{ formatProviderLabel(row.provider) }}</td>
                      <td>{{ formatPrecisionLabel(row.precision) }}</td>
                      <td>{{ formatEdgeLabel(row.colo) }}</td>
                      <td>{{ row.hasPostalCode ? 'yes' : 'no' }}</td>
                      <td>{{ row.hasCoordinates ? 'yes' : 'no' }}</td>
                      <td>{{ formatNumber(row.stats.events) }}</td>
                      <td>{{ formatNumber(row.stats.uniqueVisitors) }}</td>
                      <td>{{ formatNumber(row.stats.uniqueSessions) }}</td>
                    </tr>
                  </tbody>
                </table>
                <p v-if="!geoQualityTableRows.length" class="empty">No geo quality rows</p>
              </div>
            </article>
          </section>

          <section v-if="activeTab === 'acquisition'" class="tables-grid">
            <article class="panel">
              <header class="panel-header">
                <h2>Campaigns</h2>
                <span>{{ campaignTableRows.length }} rows</span>
              </header>
              <div class="table-wrap">
                <table class="table">
                  <thead>
                    <tr>
                      <th>Campaign</th>
                      <th>Meta</th>
                      <th>Visitors</th>
                      <th>Sessions</th>
                      <th>Views</th>
                      <th>Clicks</th>
                      <th>Rate</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="row in campaignTableRows" :key="getCampaignLabel(row)">
                      <td>{{ getCampaignLabel(row) }}</td>
                      <td>{{ getCampaignMeta(row) }}</td>
                      <td>{{ formatNumber(row.stats.uniqueVisitors) }}</td>
                      <td>{{ formatNumber(row.stats.uniqueSessions) }}</td>
                      <td>{{ formatNumber(row.stats.pageViews) }}</td>
                      <td>{{ formatNumber(row.stats.clicks) }}</td>
                      <td>{{ formatPercent(row.stats.clickRate) }}</td>
                    </tr>
                  </tbody>
                </table>
                <p v-if="!campaignTableRows.length" class="empty">No campaigns</p>
              </div>
            </article>

            <article class="panel">
              <header class="panel-header">
                <h2>Ad Target Locations</h2>
                <span>{{ adTargetTableRows.length }} rows</span>
              </header>
              <div class="table-wrap">
                <table class="table">
                  <thead>
                    <tr>
                      <th>Target</th>
                      <th>Ad Set</th>
                      <th>Visitors</th>
                      <th>Sessions</th>
                      <th>Views</th>
                      <th>Clicks</th>
                      <th>Events</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="row in adTargetTableRows" :key="getAdTargetLabel(row)">
                      <td>{{ getAdTargetLabel(row) }}</td>
                      <td>{{ optionValue(row.adSet) }}</td>
                      <td>{{ formatNumber(row.stats.uniqueVisitors) }}</td>
                      <td>{{ formatNumber(row.stats.uniqueSessions) }}</td>
                      <td>{{ formatNumber(row.stats.pageViews) }}</td>
                      <td>{{ formatNumber(row.stats.clicks) }}</td>
                      <td>{{ formatNumber(row.stats.events) }}</td>
                    </tr>
                  </tbody>
                </table>
                <p v-if="!adTargetTableRows.length" class="empty">No ad target rows</p>
              </div>
            </article>

            <article class="panel">
              <header class="panel-header">
                <h2>Campaign By Ad Target</h2>
                <span>{{ campaignAdTargetTableRows.length }} rows</span>
              </header>
              <div class="table-wrap">
                <table class="table">
                  <thead>
                    <tr>
                      <th>Campaign</th>
                      <th>Target</th>
                      <th>Visitors</th>
                      <th>Sessions</th>
                      <th>Views</th>
                      <th>Clicks</th>
                      <th>Events</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="row in campaignAdTargetTableRows"
                      :key="`${getCampaignLabel(row)}-${getAdTargetLabel(row)}`"
                    >
                      <td>{{ getCampaignLabel(row) }}</td>
                      <td>{{ getAdTargetLabel(row) }}</td>
                      <td>{{ formatNumber(row.stats.uniqueVisitors) }}</td>
                      <td>{{ formatNumber(row.stats.uniqueSessions) }}</td>
                      <td>{{ formatNumber(row.stats.pageViews) }}</td>
                      <td>{{ formatNumber(row.stats.clicks) }}</td>
                      <td>{{ formatNumber(row.stats.events) }}</td>
                    </tr>
                  </tbody>
                </table>
                <p v-if="!campaignAdTargetTableRows.length" class="empty">
                  No campaign ad target rows
                </p>
              </div>
            </article>

            <article class="panel">
              <header class="panel-header">
                <h2>Campaign By Visitor Location</h2>
                <span>{{ campaignLocationTableRows.length }} rows</span>
              </header>
              <div class="table-wrap">
                <table class="table">
                  <thead>
                    <tr>
                      <th>Campaign</th>
                      <th>Location</th>
                      <th>Visitors</th>
                      <th>Sessions</th>
                      <th>Views</th>
                      <th>Clicks</th>
                      <th>Events</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="row in campaignLocationTableRows"
                      :key="`${getCampaignLabel(row)}-${getLocationLabel(row)}`"
                    >
                      <td>{{ getCampaignLabel(row) }}</td>
                      <td>{{ getLocationLabel(row) }}</td>
                      <td>{{ formatNumber(row.stats.uniqueVisitors) }}</td>
                      <td>{{ formatNumber(row.stats.uniqueSessions) }}</td>
                      <td>{{ formatNumber(row.stats.pageViews) }}</td>
                      <td>{{ formatNumber(row.stats.clicks) }}</td>
                      <td>{{ formatNumber(row.stats.events) }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </article>

            <article class="panel">
              <header class="panel-header">
                <h2>Referrers</h2>
                <span>{{ referrerTableRows.length }} rows</span>
              </header>
              <div class="table-wrap">
                <table class="table table--compact">
                  <thead>
                    <tr>
                      <th>Host</th>
                      <th>Visitors</th>
                      <th>Sessions</th>
                      <th>Views</th>
                      <th>Clicks</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="row in referrerTableRows" :key="row.host">
                      <td>{{ row.host || 'direct' }}</td>
                      <td>{{ formatNumber(row.stats.uniqueVisitors) }}</td>
                      <td>{{ formatNumber(row.stats.uniqueSessions) }}</td>
                      <td>{{ formatNumber(row.stats.pageViews) }}</td>
                      <td>{{ formatNumber(row.stats.clicks) }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </article>
          </section>

          <section v-if="activeTab === 'behavior'" class="tables-grid">
            <article class="panel">
              <header class="panel-header">
                <h2>Pages</h2>
                <span>{{ pageTableRows.length }} rows</span>
              </header>
              <div class="table-wrap">
                <table class="table">
                  <thead>
                    <tr>
                      <th>Page</th>
                      <th>Visitors</th>
                      <th>Sessions</th>
                      <th>Views</th>
                      <th>Clicks</th>
                      <th>Avg Time</th>
                      <th>Scroll</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="row in pageTableRows" :key="row.path">
                      <td>{{ optionValue(row.path) }}</td>
                      <td>{{ formatNumber(row.stats.uniqueVisitors) }}</td>
                      <td>{{ formatNumber(row.stats.uniqueSessions) }}</td>
                      <td>{{ formatNumber(row.stats.pageViews) }}</td>
                      <td>{{ formatNumber(row.stats.clicks) }}</td>
                      <td>{{ row.stats.avgEngagementSeconds }}s</td>
                      <td>{{ formatPercent(row.stats.avgScrollDepth) }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </article>

            <article class="panel">
              <header class="panel-header">
                <h2>Clicks</h2>
                <span>{{ clickTableRows.length }} rows</span>
              </header>
              <div class="table-wrap">
                <table class="table">
                  <thead>
                    <tr>
                      <th>Element</th>
                      <th>Page</th>
                      <th>Href</th>
                      <th>Sessions</th>
                      <th>Clicks</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="row in clickTableRows" :key="`${row.label}-${row.href}-${row.path}`">
                      <td>{{ getClickLabel(row) }}</td>
                      <td>{{ optionValue(row.path) }}</td>
                      <td>{{ row.href || 'none' }}</td>
                      <td>{{ formatNumber(row.stats.uniqueSessions) }}</td>
                      <td>{{ formatNumber(row.stats.events) }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </article>

            <article class="panel">
              <header class="panel-header">
                <h2>Event Types</h2>
                <span>{{ eventTypeTableRows.length }} rows</span>
              </header>
              <div class="table-wrap">
                <table class="table table--compact">
                  <thead>
                    <tr>
                      <th>Event</th>
                      <th>Events</th>
                      <th>Visitors</th>
                      <th>Sessions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="row in eventTypeTableRows" :key="row.name">
                      <td>{{ formatEventName(row.name) }}</td>
                      <td>{{ formatNumber(row.stats.events) }}</td>
                      <td>{{ formatNumber(row.stats.uniqueVisitors) }}</td>
                      <td>{{ formatNumber(row.stats.uniqueSessions) }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </article>

            <article class="panel">
              <header class="panel-header">
                <h2>Devices</h2>
                <span>{{ deviceTableRows.length }} rows</span>
              </header>
              <div class="table-wrap">
                <table class="table table--compact">
                  <thead>
                    <tr>
                      <th>Device</th>
                      <th>Visitors</th>
                      <th>Sessions</th>
                      <th>Views</th>
                      <th>Clicks</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="row in deviceTableRows" :key="row.name">
                      <td>{{ optionValue(row.name) }}</td>
                      <td>{{ formatNumber(row.stats.uniqueVisitors) }}</td>
                      <td>{{ formatNumber(row.stats.uniqueSessions) }}</td>
                      <td>{{ formatNumber(row.stats.pageViews) }}</td>
                      <td>{{ formatNumber(row.stats.clicks) }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </article>

            <article class="panel">
              <header class="panel-header">
                <h2>Languages</h2>
                <span>{{ languageTableRows.length }} rows</span>
              </header>
              <div class="table-wrap">
                <table class="table table--compact">
                  <thead>
                    <tr>
                      <th>Language</th>
                      <th>Visitors</th>
                      <th>Sessions</th>
                      <th>Events</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="row in languageTableRows" :key="row.name">
                      <td>{{ optionValue(row.name) }}</td>
                      <td>{{ formatNumber(row.stats.uniqueVisitors) }}</td>
                      <td>{{ formatNumber(row.stats.uniqueSessions) }}</td>
                      <td>{{ formatNumber(row.stats.events) }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </article>
          </section>

          <section v-if="activeTab === 'sessions'" class="panel">
            <header class="panel-header">
              <h2>Sessions</h2>
              <span>{{ sessionTableRows.length }} rows</span>
            </header>
            <div class="table-wrap">
              <table class="table table--sessions">
                <thead>
                  <tr>
                    <th>Started</th>
                    <th>Last Seen</th>
                    <th>Duration</th>
                    <th>Session</th>
                    <th>Location</th>
                    <th>Device</th>
                    <th>Campaign</th>
                    <th>Ad Target</th>
                    <th>Referrer</th>
                    <th>Entry</th>
                    <th>Exit</th>
                    <th>Pages</th>
                    <th>Views</th>
                    <th>Clicks</th>
                    <th>Events</th>
                    <th>Scroll</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="row in sessionTableRows" :key="row.sessionId">
                    <td>{{ formatDate(row.firstSeen) }}</td>
                    <td>{{ formatDate(row.lastSeen) }}</td>
                    <td>{{ formatSeconds(row.durationSeconds) }}</td>
                    <td :title="row.sessionId">{{ shortId(row.sessionId) }}</td>
                    <td>
                      {{ getSessionLocation(row) }}
                      <span v-if="getSessionGeoNote(row)" class="cell-note">
                        {{ getSessionGeoNote(row) }}
                      </span>
                    </td>
                    <td>{{ optionValue(row.device) }}</td>
                    <td>{{ getSessionCampaign(row) }}</td>
                    <td>{{ getSessionAdTarget(row) }}</td>
                    <td>{{ row.referrerHost || 'direct' }}</td>
                    <td>{{ optionValue(row.entryPage) }}</td>
                    <td>{{ optionValue(row.exitPage) }}</td>
                    <td>{{ getSessionPages(row) }}</td>
                    <td>{{ formatNumber(row.stats.pageViews) }}</td>
                    <td>{{ formatNumber(row.stats.clicks) }}</td>
                    <td>{{ formatNumber(row.stats.events) }}</td>
                    <td>{{ formatPercent(row.stats.avgScrollDepth) }}</td>
                  </tr>
                </tbody>
              </table>

              <p v-if="!sessionTableRows.length" class="empty">No sessions match these filters</p>
            </div>
          </section>

          <section v-if="activeTab === 'events'" class="panel">
            <header class="panel-header">
              <h2>Recent Events</h2>
              <label class="inline-control">
                <span>Rows</span>
                <select v-model.number="eventLimit" class="select">
                  <option :value="100">100</option>
                  <option :value="250">250</option>
                  <option :value="500">500</option>
                  <option :value="1000">1,000</option>
                </select>
              </label>
            </header>
            <div class="table-wrap">
              <table class="table table--events">
                <thead>
                  <tr>
                    <th>Time</th>
                    <th>Event</th>
                    <th>Location</th>
                    <th>Geo</th>
                    <th>Page</th>
                    <th>Campaign</th>
                    <th>Ad Target</th>
                    <th>Detail</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="event in recentEvents" :key="event.id">
                    <td>{{ formatDate(event.receivedAt) }}</td>
                    <td>{{ formatEventName(event.eventName) }}</td>
                    <td>{{ formatLocation(event) }}</td>
                    <td>{{ formatGeoDetail(event) }}</td>
                    <td>{{ event.payload?.page?.path || 'unknown' }}</td>
                    <td>
                      {{
                        [event.payload?.page?.utm?.source, event.payload?.page?.utm?.campaign]
                          .filter(Boolean)
                          .join(' / ') || 'none'
                      }}
                    </td>
                    <td>{{ formatAdTarget(event) }}</td>
                    <td>{{ formatEventDetail(event) }}</td>
                  </tr>
                </tbody>
              </table>

              <p v-if="!recentEvents.length" class="empty">No events yet</p>
            </div>
          </section>

          <footer class="footer">
            <span>Updated {{ formatDate(summary.generatedAt) }}</span>
            <span>
              {{ formatNumber(summary.matchedEvents) }} matched /
              {{ formatNumber(summary.scannedEvents) }} scanned
            </span>
          </footer>
        </div>
      </template>
    </div>
  </section>
</template>

<script lang="ts" src="./script.ts" />
<style lang="scss" scoped src="./styles.scss" />
